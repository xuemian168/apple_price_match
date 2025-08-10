import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, ExchangeRate } from '@/types';
import fs from 'fs';
import path from 'path';

// Fallback exchange rates in case API fails
const fallbackExchangeRates: Record<string, number> = {
  USD: 1.0,
  CNY: 7.25,
  JPY: 148.0,
  KRW: 1310.0,
  GBP: 0.78,
  EUR: 0.92,
  AUD: 1.52,
  CAD: 1.36,
  SGD: 1.34,
  HKD: 7.82,
  TWD: 32.1,
  BRL: 5.1,
  MXN: 17.2,
  CLP: 920.0,
  INR: 83.0,
  THB: 35.5,
  VND: 24500.0,
  IDR: 15800.0,
  MYR: 4.65,
  PHP: 56.0,
  NZD: 1.68,
  ZAR: 18.5,
  RUB: 95.0,
  TRY: 29.5,
  ILS: 3.8,
  AED: 3.67,
  SAR: 3.75,
  EGP: 48.5,
  NGN: 1520.0,
  PLN: 4.05,
  CZK: 23.0,
  HUF: 365.0,
  RON: 4.55,
  BGN: 1.8,
  CHF: 0.88,
  NOK: 10.8,
  SEK: 10.9,
  DKK: 6.85,
  COP: 4200.0,
  PEN: 3.75,
  QAR: 3.64,
  KZT: 450.0,
  PKR: 278.0,
  TZS: 2500.0,
};

// List of currencies we need rates for
const requiredCurrencies = Object.keys(fallbackExchangeRates);

// Cache configuration
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
const CACHE_FILE_PATH = path.join(process.cwd(), '.cache', 'exchange-rates.json');

// In-memory cache
let memoryCache: {
  data: Record<string, number>;
  timestamp: number;
  isFromAPI: boolean;
} | null = null;

interface CacheData {
  data: Record<string, number>;
  timestamp: number;
  isFromAPI: boolean;
}

// Ensure cache directory exists
function ensureCacheDir() {
  const cacheDir = path.dirname(CACHE_FILE_PATH);
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
}

// Load cache from file
function loadCacheFromFile(): CacheData | null {
  try {
    if (fs.existsSync(CACHE_FILE_PATH)) {
      const cacheContent = fs.readFileSync(CACHE_FILE_PATH, 'utf8');
      const cache = JSON.parse(cacheContent) as CacheData;
      
      // Check if cache is still valid
      if (Date.now() - cache.timestamp < CACHE_DURATION) {
        return cache;
      }
    }
  } catch (error) {
    console.warn('Failed to load exchange rate cache from file:', error);
  }
  return null;
}

// Save cache to file
function saveCacheToFile(cache: CacheData) {
  try {
    ensureCacheDir();
    fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(cache, null, 2));
  } catch (error) {
    console.warn('Failed to save exchange rate cache to file:', error);
  }
}

// Get cached rates (check memory first, then file)
function getCachedRates(): CacheData | null {
  // Check memory cache first
  if (memoryCache && Date.now() - memoryCache.timestamp < CACHE_DURATION) {
    return memoryCache;
  }

  // Check file cache
  const fileCache = loadCacheFromFile();
  if (fileCache) {
    // Update memory cache
    memoryCache = fileCache;
    return fileCache;
  }

  return null;
}

// Set cache (both memory and file)
function setCachedRates(data: Record<string, number>, isFromAPI: boolean) {
  const cacheData: CacheData = {
    data,
    timestamp: Date.now(),
    isFromAPI,
  };

  // Update memory cache
  memoryCache = cacheData;

  // Save to file
  saveCacheToFile(cacheData);
}

async function fetchRealExchangeRates(): Promise<Record<string, number>> {
  try {
    // Using exchangerate-api.com (free tier: 1500 requests/month)
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Apple-Price-Match-App/1.0',
      },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.rates) {
      throw new Error('Invalid response format from exchange rate API');
    }

    // Extract only the currencies we need
    const rates: Record<string, number> = { USD: 1.0 };
    
    for (const currency of requiredCurrencies) {
      if (currency === 'USD') continue;
      
      if (data.rates[currency]) {
        rates[currency] = data.rates[currency];
      } else {
        // Use fallback rate if not available in API
        rates[currency] = fallbackExchangeRates[currency];
        console.warn(`Using fallback rate for ${currency}`);
      }
    }

    return rates;
  } catch (error) {
    console.error('Failed to fetch real exchange rates:', error);
    // Return fallback rates on any error
    return fallbackExchangeRates;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ExchangeRate[]>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      timestamp: new Date().toISOString(),
    });
  }

  try {
    // Check if we have valid cached rates first
    const cachedRates = getCachedRates();
    
    if (cachedRates) {
      console.log('Using cached exchange rates');
      
      const exchangeRates: ExchangeRate[] = Object.entries(cachedRates.data).map(
        ([currency, rate]) => ({
          from: 'USD',
          to: currency,
          rate: rate,
          lastUpdated: new Date(cachedRates.timestamp).toISOString(),
        })
      );

      const response: ApiResponse<ExchangeRate[]> = {
        success: true,
        data: exchangeRates,
        timestamp: new Date().toISOString(),
      };

      // Add warning if cache is from fallback data
      if (!cachedRates.isFromAPI) {
        response.warning = 'Using cached fallback exchange rates';
      }

      return res.status(200).json(response);
    }

    // No valid cache, try to fetch fresh rates
    console.log('Fetching fresh exchange rates');
    let rates: Record<string, number>;
    let isFromAPI = true;
    let warning: string | undefined;

    try {
      rates = await fetchRealExchangeRates();
      // Check if we got real API data or fallback data
      if (JSON.stringify(rates) === JSON.stringify(fallbackExchangeRates)) {
        isFromAPI = false;
        warning = 'Using fallback exchange rates due to API unavailability';
      }
    } catch (error) {
      console.error('Failed to fetch exchange rates, using fallback:', error);
      rates = fallbackExchangeRates;
      isFromAPI = false;
      warning = 'Using fallback exchange rates due to API error';
    }

    // Cache the rates (both API and fallback data)
    setCachedRates(rates, isFromAPI);
    
    const exchangeRates: ExchangeRate[] = Object.entries(rates).map(
      ([currency, rate]) => ({
        from: 'USD',
        to: currency,
        rate: rate,
        lastUpdated: new Date().toISOString(),
      })
    );

    const response: ApiResponse<ExchangeRate[]> = {
      success: true,
      data: exchangeRates,
      timestamp: new Date().toISOString(),
    };

    if (warning) {
      response.warning = warning;
    }

    res.status(200).json(response);
  } catch (error) {
    console.error('Exchange rate handler error:', error);
    
    // Final fallback - return fallback rates without caching
    const fallbackRates: ExchangeRate[] = Object.entries(fallbackExchangeRates).map(
      ([currency, rate]) => ({
        from: 'USD',
        to: currency,
        rate: rate,
        lastUpdated: new Date().toISOString(),
      })
    );

    res.status(200).json({
      success: true,
      data: fallbackRates,
      timestamp: new Date().toISOString(),
      warning: 'Using emergency fallback exchange rates',
    });
  }
}
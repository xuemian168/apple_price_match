import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, PricingComparisonResult, iCloudPricing } from '@/types';
import { sampleiCloudPricing, getPricingByPlan } from '@/data/sample-icloud-pricing';
import { getiCloudPlanById } from '@/data/icloud-plans';

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

async function fetchRealExchangeRates(): Promise<Record<string, number>> {
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Apple-Price-Match-App/1.0',
      },
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
    const requiredCurrencies = Object.keys(fallbackExchangeRates);
    
    for (const currency of requiredCurrencies) {
      if (currency === 'USD') continue;
      
      if (data.rates[currency]) {
        rates[currency] = data.rates[currency];
      } else {
        rates[currency] = fallbackExchangeRates[currency];
        console.warn(`Using fallback rate for ${currency}`);
      }
    }

    return rates;
  } catch (error) {
    console.error('Failed to fetch real exchange rates:', error);
    return fallbackExchangeRates;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<PricingComparisonResult>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const { plan, countries, currency } = req.query;

    if (!plan || typeof plan !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Plan parameter is required',
        timestamp: new Date().toISOString(),
      });
    }

    const planData = getiCloudPlanById(plan);
    if (!planData) {
      return res.status(404).json({
        success: false,
        error: 'Plan not found',
        timestamp: new Date().toISOString(),
      });
    }

    let pricing = getPricingByPlan(plan);

    // Filter by countries if specified
    if (countries && typeof countries === 'string') {
      const countryList = countries.split(',').map(c => c.trim());
      pricing = pricing.filter(p => countryList.includes(p.country));
    }

    // Fetch real-time exchange rates
    const exchangeRates = await fetchRealExchangeRates();

    // Convert prices if target currency is specified
    const targetCurrency = currency && typeof currency === 'string' ? currency : 'USD';
    
    const convertedPricing: iCloudPricing[] = pricing.map(p => {
      const fromRate = exchangeRates[p.currency] || 1;
      const toRate = exchangeRates[targetCurrency] || 1;
      
      if (p.currency === targetCurrency) {
        return p; // No conversion needed
      }

      const convertedMonthly = (p.originalPriceMonthly / fromRate) * toRate;
      const convertedYearly = p.originalPriceYearly ? (p.originalPriceYearly / fromRate) * toRate : undefined;

      return {
        ...p,
        currency: targetCurrency,
        priceMonthly: convertedMonthly,
        priceYearly: convertedYearly,
      };
    });

    const result: PricingComparisonResult = {
      plan: planData,
      pricing: convertedPricing,
      exchangeRates: exchangeRates,
      lastUpdated: new Date().toISOString(),
    };

    res.status(200).json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('iCloud pricing API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch iCloud pricing',
      timestamp: new Date().toISOString(),
    });
  }
}
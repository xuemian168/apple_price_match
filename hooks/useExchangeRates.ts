import { useState, useEffect } from 'react';
import axios from 'axios';
import { ExchangeRate, ApiResponse } from '@/types';

interface UseExchangeRatesReturn {
  rates: Record<string, number>;
  loading: boolean;
  error: string | null;
  warning: string | null;
  refetch: () => void;
  lastUpdated: string | null;
}

export function useExchangeRates(): UseExchangeRatesReturn {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchRates = async () => {
    try {
      setLoading(true);
      setError(null);
      setWarning(null);
      
      const response = await axios.get<ApiResponse<ExchangeRate[]>>('/api/exchange-rates');
      
      if (response.data.success && response.data.data) {
        const ratesObject = response.data.data.reduce((acc, rate) => {
          acc[rate.to] = rate.rate;
          return acc;
        }, {} as Record<string, number>);
        
        setRates(ratesObject);
        setLastUpdated(response.data.timestamp);
        
        // Set warning if using fallback rates
        if (response.data.warning) {
          setWarning(response.data.warning);
        }
      } else {
        setError(response.data.error || 'Failed to fetch exchange rates');
      }
    } catch (err) {
      setError('Network error while fetching exchange rates');
      console.error('Exchange rates fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  return {
    rates,
    loading,
    error,
    warning,
    refetch: fetchRates,
    lastUpdated,
  };
}
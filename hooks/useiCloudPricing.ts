import { useState, useEffect } from 'react';
import axios from 'axios';
import { PricingComparisonResult, ApiResponse } from '@/types';

interface UseiCloudPricingProps {
  plan: string;
  countries?: string[];
  targetCurrency?: string;
}

interface UseiCloudPricingReturn {
  data: PricingComparisonResult | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  lastUpdated: string | null;
}

export function useiCloudPricing({
  plan,
  countries,
  targetCurrency = 'USD',
}: UseiCloudPricingProps): UseiCloudPricingReturn {
  const [data, setData] = useState<PricingComparisonResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchPricing = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        plan,
        currency: targetCurrency,
      });

      if (countries && countries.length > 0) {
        params.append('countries', countries.join(','));
      }

      const response = await axios.get<ApiResponse<PricingComparisonResult>>(
        `/api/icloud-pricing?${params.toString()}`
      );

      if (response.data.success && response.data.data) {
        setData(response.data.data);
        setLastUpdated(response.data.timestamp);
      } else {
        setError(response.data.error || 'Failed to fetch iCloud pricing');
      }
    } catch (err) {
      setError('Network error while fetching iCloud pricing');
      console.error('iCloud pricing fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (plan) {
      fetchPricing();
    }
  }, [plan, countries?.join(','), targetCurrency]);

  return {
    data,
    loading,
    error,
    refetch: fetchPricing,
    lastUpdated,
  };
}
import React from 'react';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, DollarSign, Percent, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { iCloudPricing, iCloudPlan } from '@/types';
import { getCountryByCode } from '@/data/countries';
import { getCurrencyByCode } from '@/data/currencies';
import { formatCurrency } from '@/lib/utils';

interface SavingsCardProps {
  plan: iCloudPlan;
  pricing: iCloudPricing[];
  targetCurrency: string;
  className?: string;
}

interface SavingsData {
  lowestPrice: iCloudPricing;
  highestPrice: iCloudPricing;
  averagePrice: number;
  monthlyRange: {
    min: number;
    max: number;
    difference: number;
  };
  annualSavings: {
    maxSavings: number;
    avgSavings: number;
    percentSavings: number;
  };
}

export function SavingsCard({ plan, pricing, targetCurrency, className }: SavingsCardProps) {
  const { t } = useTranslation('common');

  // Calculate savings data
  const calculateSavings = (): SavingsData | null => {
    if (!pricing || pricing.length === 0) return null;

    const sortedByPrice = [...pricing].sort((a, b) => a.priceMonthly - b.priceMonthly);
    const lowestPrice = sortedByPrice[0];
    const highestPrice = sortedByPrice[sortedByPrice.length - 1];
    
    const averagePrice = pricing.reduce((sum, item) => sum + item.priceMonthly, 0) / pricing.length;
    
    const monthlyDifference = highestPrice.priceMonthly - lowestPrice.priceMonthly;
    const annualMaxSavings = monthlyDifference * 12;
    const annualAvgSavings = (averagePrice - lowestPrice.priceMonthly) * 12;
    const percentSavings = ((highestPrice.priceMonthly - lowestPrice.priceMonthly) / highestPrice.priceMonthly) * 100;

    return {
      lowestPrice,
      highestPrice,
      averagePrice,
      monthlyRange: {
        min: lowestPrice.priceMonthly,
        max: highestPrice.priceMonthly,
        difference: monthlyDifference,
      },
      annualSavings: {
        maxSavings: annualMaxSavings,
        avgSavings: annualAvgSavings,
        percentSavings,
      },
    };
  };

  const savingsData = calculateSavings();
  
  if (!savingsData) {
    return null;
  }

  const lowestCountry = getCountryByCode(savingsData.lowestPrice.country);
  const highestCountry = getCountryByCode(savingsData.highestPrice.country);
  const currencyData = getCurrencyByCode(targetCurrency);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-100/30 dark:bg-green-900/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-100/30 dark:bg-emerald-900/10 rounded-full translate-y-12 -translate-x-12" />
        
        <CardHeader className="relative pb-2">
          <CardTitle className="text-lg font-bold text-green-800 dark:text-green-200 flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              💰
            </motion.div>
            {t('savings.title')}
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-lg ml-auto"
            >
              🎯
            </motion.div>
          </CardTitle>
        </CardHeader>

        <CardContent className="relative space-y-3">
          {/* Annual Maximum Savings - Hero Section */}
          <motion.div 
            className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg border border-green-200 dark:border-green-800"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(savingsData.annualSavings.maxSavings, targetCurrency)}
            </div>
            <div className="text-sm text-green-700 dark:text-green-300 font-medium">
              {t('savings.max_annual_savings')} ({savingsData.annualSavings.percentSavings.toFixed(1)}% {t('savings.savings_percentage')})
            </div>
          </motion.div>

          {/* Price Comparison */}
          <div className="grid grid-cols-2 gap-2">
            {/* Cheapest Option */}
            <motion.div 
              className="bg-white/70 dark:bg-black/30 rounded-lg p-2 border border-green-200 dark:border-green-700"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-1 mb-1">
                <TrendingDown className="h-3 w-3 text-green-600" />
                <span className="text-xs font-medium text-green-800 dark:text-green-200">
                  {t('savings.cheapest')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">{lowestCountry?.flag}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-green-700 dark:text-green-300 truncate">
                    {lowestCountry?.name}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400">
                    {formatCurrency(savingsData.lowestPrice.priceMonthly, targetCurrency)}{t('savings.per_month')}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Most Expensive */}
            <motion.div 
              className="bg-red-50/70 dark:bg-red-950/30 rounded-lg p-2 border border-red-200 dark:border-red-700"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp className="h-3 w-3 text-red-600" />
                <span className="text-xs font-medium text-red-800 dark:text-red-200">
                  {t('savings.most_expensive')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">{highestCountry?.flag}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-red-700 dark:text-red-300 truncate">
                    {highestCountry?.name}
                  </div>
                  <div className="text-xs text-red-600 dark:text-red-400">
                    {formatCurrency(savingsData.highestPrice.priceMonthly, targetCurrency)}{t('savings.per_month')}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Savings Breakdown */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-green-700 dark:text-green-300">{t('savings.monthly_difference')}:</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                {formatCurrency(savingsData.monthlyRange.difference, targetCurrency)}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-green-700 dark:text-green-300">{t('savings.avg_vs_cheapest')}:</span>
              <Badge variant="outline" className="border-green-300 text-green-700 text-xs">
                {formatCurrency(savingsData.annualSavings.avgSavings, targetCurrency)}{t('savings.per_year')}
              </Badge>
            </div>
          </div>

          {/* Statistics Summary */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-xs text-muted-foreground">{t('savings.countries_compared')}</div>
              <div className="text-sm font-semibold text-green-700 dark:text-green-300">{pricing.length}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">{t('savings.price_range')}</div>
              <div className="text-sm font-semibold text-green-700 dark:text-green-300">
                {((savingsData.monthlyRange.difference / savingsData.monthlyRange.min) * 100).toFixed(0)}%
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">{t('savings.avg_price')}</div>
              <div className="text-sm font-semibold text-green-700 dark:text-green-300">
                {formatCurrency(savingsData.averagePrice, targetCurrency)}
              </div>
            </div>
          </div>

          {/* Pro Tip */}
          <motion.div 
            className="flex items-start gap-2 p-2 bg-blue-50/70 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-sm">💡</div>
            <div className="text-xs text-blue-700 dark:text-blue-300">
              <span className="font-medium">{t('savings.pro_tip')}:</span> {t('savings.tip_description')}
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
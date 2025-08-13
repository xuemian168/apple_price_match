import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import { Users, Calculator, AlertTriangle, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { iCloudPlan, iCloudPricing, SharingCalculation } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { getCountryByCode } from '@/data/countries';

interface SharingCalculatorCardProps {
  plan: iCloudPlan;
  pricing: iCloudPricing[];
  targetCurrency: string;
  selectedCountryCode: string | null;
  className?: string;
}

export function SharingCalculatorCard({ plan, pricing, targetCurrency, selectedCountryCode, className }: SharingCalculatorCardProps) {
  const { t } = useTranslation('common');
  const [memberCount, setMemberCount] = useState(6); // Default to maximum savings (6 people)

  // Only show for plans that support family sharing
  if (!plan.supportsFamilySharing) {
    return null;
  }

  // Only show if user has clicked on a specific country
  if (!selectedCountryCode) {
    return null;
  }

  // Find pricing data for selected country
  const selectedCountryPricing = pricing.find(item => item.country === selectedCountryCode);
  
  if (!selectedCountryPricing) {
    return null;
  }

  const countryMonthlyPrice = selectedCountryPricing.priceMonthly;

  // Calculate sharing data for different member counts
  const calculateSharingData = (): SharingCalculation[] => {
    if (countryMonthlyPrice === 0) return [];

    return [2, 3, 4, 5, 6].map(count => {
      const pricePerPerson = countryMonthlyPrice / count;
      const annualSavingsPerPerson = (countryMonthlyPrice - pricePerPerson) * 12;
      const totalSavings = annualSavingsPerPerson * count;

      return {
        memberCount: count,
        pricePerPerson,
        annualSavingsPerPerson,
        totalSavings,
      };
    });
  };

  const sharingCalculations = calculateSharingData();
  const currentCalculation = sharingCalculations.find(calc => calc.memberCount === memberCount);

  if (!currentCalculation || countryMonthlyPrice === 0) {
    return null;
  }

  // Get country information
  const countryInfo = getCountryByCode(selectedCountryCode);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100/30 dark:bg-purple-900/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-100/30 dark:bg-pink-900/10 rounded-full translate-y-12 -translate-x-12" />
        
        <CardHeader className="relative pb-2">
          <CardTitle className="text-lg font-bold text-purple-800 dark:text-purple-200 flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              👥
            </motion.div>
            {t('sharing.title')}
          </CardTitle>
          <CardDescription className="text-purple-700 dark:text-purple-300">
            {t('sharing.description_with_country', { 
              storage: plan.storage, 
              country: countryInfo?.name || selectedCountryCode,
              price: formatCurrency(countryMonthlyPrice, targetCurrency)
            })}
          </CardDescription>
        </CardHeader>

        <CardContent className="relative space-y-4">
          {/* Member Count Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-purple-700 dark:text-purple-300">
                {t('sharing.member_count')}: <span className="text-lg font-bold">{memberCount}</span> {t('sharing.people')}
              </label>
              <Badge variant="outline" className="border-purple-300 text-purple-700">
                {t('sharing.max_members', { count: 6 })}
              </Badge>
            </div>
            
            <div className="px-2">
              <Slider
                value={[memberCount]}
                onValueChange={(value: number[]) => setMemberCount(value[0])}
                min={2}
                max={6}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>2 {t('sharing.people')}</span>
                <span>6 {t('sharing.people')}</span>
              </div>
            </div>
          </div>

          {/* Current Calculation Display */}
          <motion.div 
            className="text-center p-3 bg-white/60 dark:bg-black/20 rounded-lg border border-purple-200 dark:border-purple-800"
            key={memberCount}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {formatCurrency(currentCalculation.pricePerPerson, targetCurrency)}{t('savings.per_month')}
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-300 font-medium">
              {t('sharing.per_person')}
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              {t('sharing.vs_solo')}: {formatCurrency(countryMonthlyPrice, targetCurrency)}{t('savings.per_month')}
            </div>
          </motion.div>

          {/* Savings Comparison */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/70 dark:bg-black/30 rounded-lg p-2 border border-purple-200 dark:border-purple-700">
              <div className="flex items-center gap-1 mb-1">
                <TrendingDown className="h-3 w-3 text-green-600" />
                <span className="text-xs font-medium text-green-800 dark:text-green-200">
                  {t('sharing.monthly_savings')}
                </span>
              </div>
              <div className="text-sm font-semibold text-green-700 dark:text-green-300">
                {formatCurrency(countryMonthlyPrice - currentCalculation.pricePerPerson, targetCurrency)}
              </div>
            </div>

            <div className="bg-emerald-50/70 dark:bg-emerald-950/30 rounded-lg p-2 border border-emerald-200 dark:border-emerald-700">
              <div className="flex items-center gap-1 mb-1">
                <Calculator className="h-3 w-3 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-800 dark:text-emerald-200">
                  {t('sharing.annual_savings')}
                </span>
              </div>
              <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                {formatCurrency(currentCalculation.annualSavingsPerPerson, targetCurrency)}
              </div>
            </div>
          </div>

          {/* Quick Comparison Table */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-purple-700 dark:text-purple-300">
              {t('sharing.price_comparison')}
            </h4>
            <div className="space-y-1">
              {sharingCalculations.map((calc) => (
                <motion.div
                  key={calc.memberCount}
                  className={`flex justify-between items-center p-2 rounded text-xs ${
                    calc.memberCount === memberCount
                      ? 'bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-600'
                      : 'bg-white/40 dark:bg-black/20'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="font-medium">
                    {calc.memberCount} {t('sharing.people')}
                  </span>
                  <span className="font-bold">
                    {formatCurrency(calc.pricePerPerson, targetCurrency)}{t('savings.per_month')}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Warning/Info Section */}
          <motion.div 
            className="flex items-start gap-2 p-2 bg-amber-50/70 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-amber-700 dark:text-amber-300">
              <div className="font-medium mb-1">{t('sharing.important_note')}:</div>
              <div>{t('sharing.family_sharing_note')}</div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
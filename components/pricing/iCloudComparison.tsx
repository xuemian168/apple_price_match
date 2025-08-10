import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw, AlertCircle, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CurrencySelector } from '@/components/currency/CurrencySelector';
import { CountrySelector } from '@/components/country/CountrySelector';
import { iCloudPricingTable as ICloudPricingTable } from './iCloudPricingTable';
import { AnimatedStorageSelector } from './AnimatedStorageSelector';
import { useiCloudPricing } from '@/hooks/useiCloudPricing';
import { useExchangeRates } from '@/hooks/useExchangeRates';
import { icloudPlans, getPaidPlans } from '@/data/icloud-plans';
import { countries } from '@/data/countries';

interface iCloudComparisonProps {
  className?: string;
}

export function iCloudComparison({ className }: iCloudComparisonProps) {
  const { t } = useTranslation('common');
  const [selectedPlan, setSelectedPlan] = useState('50gb');
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['US', 'AU', 'GB', 'CA', 'CN', 'JP', 'KR', 'TR', 'IN', 'BR', 'SG', 'MY']);
  const [targetCurrency, setTargetCurrency] = useState('USD');
  const [showOriginalPrices, setShowOriginalPrices] = useState(true);
  const [sortBy, setSortBy] = useState<'price' | 'country' | 'none'>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const { 
    data: pricingData, 
    loading: pricingLoading, 
    error: pricingError,
    refetch: refetchPricing 
  } = useiCloudPricing({
    plan: selectedPlan,
    countries: selectedCountries,
    targetCurrency,
  });

  const {
    rates: exchangeRates,
    loading: ratesLoading,
    error: ratesError,
    warning: ratesWarning,
    refetch: refetchRates,
    lastUpdated: ratesLastUpdated,
  } = useExchangeRates();

  const paidPlans = getPaidPlans();
  const loading = pricingLoading || ratesLoading;
  const error = pricingError || ratesError;

  const handleRefresh = () => {
    refetchPricing();
    refetchRates();
  };

  const handleSortChange = (newSortBy: 'price' | 'country' | 'none', newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  return (
    <div className={className}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('icloud.title')}</CardTitle>
          <CardDescription>{t('icloud.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Storage Plan Selection with Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatedStorageSelector
              plans={paidPlans}
              selectedPlan={selectedPlan}
              onPlanChange={setSelectedPlan}
            />
          </motion.div>

          {/* Other Controls with Staggered Animation */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <label className="text-sm font-medium flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                >
                  💱
                </motion.div>
                {t('currency.select')}
              </label>
              <CurrencySelector
                value={targetCurrency}
                onChange={setTargetCurrency}
                className="w-full"
              />
            </motion.div>

            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <label className="text-sm font-medium flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                >
                  ⚡
                </motion.div>
                Actions & Sorting
              </label>
              <div className="flex flex-wrap gap-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowOriginalPrices(!showOriginalPrices)}
                  >
                    {showOriginalPrices ? 'Hide' : 'Show'} Original
                  </Button>
                </motion.div>

                <motion.div 
                  className="flex gap-1 border rounded-md"
                  whileHover={{ scale: 1.02 }}
                >
                  <Button
                    variant={sortBy === 'price' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => handleSortChange('price', sortOrder)}
                    className="flex items-center gap-1 rounded-r-none border-r"
                  >
                    <motion.div
                      animate={sortBy === 'price' ? { rotate: [0, 5, -5, 0] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <ArrowUpDown className="h-3 w-3" />
                    </motion.div>
                    Price
                  </Button>
                  <Button
                    variant={sortBy === 'country' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => handleSortChange('country', sortOrder)}
                    className="flex items-center gap-1 rounded-l-none rounded-r-none border-r"
                  >
                    <motion.div
                      animate={sortBy === 'country' ? { rotate: [0, 5, -5, 0] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <ArrowUpDown className="h-3 w-3" />
                    </motion.div>
                    Country
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="flex items-center gap-1 rounded-l-none"
                    disabled={sortBy === 'none'}
                  >
                    <motion.div
                      animate={{ rotate: sortOrder === 'asc' ? 0 : 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      {sortOrder === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    </motion.div>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Country Selection with Animation */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <label className="text-sm font-medium flex items-center gap-2">
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  repeatDelay: 3,
                  ease: "easeInOut"
                }}
              >
                🌍
              </motion.div>
              {t('country.select')}
            </label>
            <CountrySelector
              selectedCountries={selectedCountries}
              onSelectionChange={setSelectedCountries}
              multiple={true}
            />
          </motion.div>

          {/* Exchange Rate Info with Animation */}
          <AnimatePresence>
            {ratesLastUpdated && (
              <motion.div 
                className="text-xs text-muted-foreground"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🔄
                  </motion.div>
                  {t('currency.rates_updated')}: {new Date(ratesLastUpdated).toLocaleString()}
                </div>
                
                {/* Cache status indicator */}
                <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    💾
                  </motion.div>
                  <span>{t('currency.cache_warning')}</span>
                </div>

                <AnimatePresence>
                  {ratesWarning && (
                    <motion.div 
                      className="text-amber-600 mt-1"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                    >
                      <motion.span
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        ⚠️
                      </motion.span>
                      {' '}{ratesWarning}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert className="mb-6 border-destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Enhanced Loading State */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center py-12 space-y-4"
          >
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1.5, repeat: Infinity }
              }}
            >
              <Loader2 className="h-8 w-8 text-primary" />
            </motion.div>
            
            <motion.div className="text-center space-y-2">
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-lg font-medium"
              >
                {t('common.loading')}
              </motion.p>
              <motion.p
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-sm text-muted-foreground"
              >
                Fetching real-time pricing data...
              </motion.p>
            </motion.div>
            
            {/* Loading progress bar */}
            <motion.div className="w-64 h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-blue-500"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        )}

        {/* Enhanced Content */}
        {!loading && pricingData && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ 
              duration: 0.5,
              ease: "easeOut",
              staggerChildren: 0.1
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ICloudPricingTable
                plan={pricingData.plan!}
                pricing={pricingData.pricing as any}
                exchangeRates={pricingData.exchangeRates}
                targetCurrency={targetCurrency}
                showOriginalPrices={showOriginalPrices}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
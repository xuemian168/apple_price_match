import React from 'react';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { iCloudPricing, iCloudPlan } from '@/types';
import { getCountryByCode } from '@/data/countries';
import { getCurrencyByCode } from '@/data/currencies';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CountryFlag } from '@/components/ui/country-flag';

interface iCloudPricingTableProps {
  plan: iCloudPlan;
  pricing: iCloudPricing[];
  exchangeRates: Record<string, number>;
  targetCurrency: string;
  showOriginalPrices?: boolean;
  sortBy?: 'price' | 'country' | 'none';
  sortOrder?: 'asc' | 'desc';
  onSortChange?: (sortBy: 'price' | 'country' | 'none', sortOrder: 'asc' | 'desc') => void;
  className?: string;
}

export function iCloudPricingTable({
  plan,
  pricing,
  exchangeRates,
  targetCurrency,
  showOriginalPrices = true,
  sortBy = 'price',
  sortOrder = 'asc',
  onSortChange,
  className,
}: iCloudPricingTableProps) {
  const { t } = useTranslation('common');
  const targetCurrencyData = getCurrencyByCode(targetCurrency);

  // Calculate average monthly price
  const averageMonthlyPrice = pricing.length > 0 
    ? pricing.reduce((sum, item) => sum + item.priceMonthly, 0) / pricing.length 
    : 0;

  // Calculate average yearly price (if available)
  const yearlyPrices = pricing.filter(item => item.priceYearly);
  const averageYearlyPrice = yearlyPrices.length > 0
    ? yearlyPrices.reduce((sum, item) => sum + (item.priceYearly || 0), 0) / yearlyPrices.length
    : 0;

  const handleSort = (newSortBy: 'price' | 'country') => {
    if (!onSortChange) return;
    
    if (sortBy === newSortBy) {
      // Toggle order if same column
      onSortChange(newSortBy, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, default to ascending
      onSortChange(newSortBy, 'asc');
    }
  };

  const sortedPricing = [...pricing].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'price') {
      comparison = a.priceMonthly - b.priceMonthly;
    } else if (sortBy === 'country') {
      const countryA = getCountryByCode(a.country)?.name || a.country;
      const countryB = getCountryByCode(b.country)?.name || b.country;
      comparison = countryA.localeCompare(countryB);
    } else {
      // No sorting - keep original order
      return 0;
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>{plan.storage}</span>
          <span className="text-lg">{t('icloud.title')}</span>
        </CardTitle>
        <CardDescription>
          {t('icloud.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className={`min-w-[150px] ${onSortChange ? 'cursor-pointer hover:bg-muted/50' : ''}`}
                  onClick={() => onSortChange && handleSort('country')}
                >
                  <div className="flex items-center gap-1">
                    {t('country.label')}
                    {onSortChange && sortBy === 'country' && (
                      sortOrder === 'asc' ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className={`text-right ${onSortChange ? 'cursor-pointer hover:bg-muted/50' : ''}`}
                  onClick={() => onSortChange && handleSort('price')}
                >
                  <div className="flex items-center justify-end gap-1">
                    {t('icloud.features.price_monthly')}
                    {onSortChange && sortBy === 'price' && (
                      sortOrder === 'asc' ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                {sortedPricing.some(p => p.priceYearly) && (
                  <TableHead className="text-right">
                    {t('icloud.features.price_yearly')}
                  </TableHead>
                )}
                {showOriginalPrices && (
                  <TableHead className="text-right">
                    {t('icloud.features.original_currency')}
                  </TableHead>
                )}
                <TableHead className="text-right min-w-[100px]">
                  {t('icloud.features.exchange_rate')}
                </TableHead>
                <TableHead className="text-right min-w-[120px]">
                  {t('icloud.features.last_updated')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPricing.map((item, index) => {
                const country = getCountryByCode(item.country);
                const originalCurrency = getCurrencyByCode(item.originalCurrency);
                
                return (
                  <TableRow
                    key={`${item.country}-${item.plan}`}
                    className="hover:bg-muted/50"
                  >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <CountryFlag countryCode={item.country} size="md" />
                          <div>
                            <div>{country?.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {item.currency}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-right font-medium">
                        <div className="text-primary">
                          {formatCurrency(item.priceMonthly, targetCurrency)}
                        </div>
                        {targetCurrencyData && (
                          <div className="text-xs text-muted-foreground">
                            {targetCurrencyData.symbol}{item.priceMonthly.toFixed(2)}
                          </div>
                        )}
                      </TableCell>

                      {sortedPricing.some(p => p.priceYearly) && (
                        <TableCell className="text-right font-medium">
                          {item.priceYearly ? (
                            <div>
                              <div className="text-primary">
                                {formatCurrency(item.priceYearly, targetCurrency)}
                              </div>
                              {targetCurrencyData && (
                                <div className="text-xs text-muted-foreground">
                                  {targetCurrencyData.symbol}{item.priceYearly.toFixed(2)}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      )}

                      {showOriginalPrices && (
                        <TableCell className="text-right">
                          <div className="text-sm">
                            <div>
                              {originalCurrency?.symbol}{item.originalPriceMonthly.toFixed(2)}
                            </div>
                            {item.originalPriceYearly && (
                              <div className="text-xs text-muted-foreground">
                                Yearly: {originalCurrency?.symbol}{item.originalPriceYearly.toFixed(2)}
                              </div>
                            )}
                          </div>
                        </TableCell>
                      )}

                      <TableCell className="text-right">
                        <div className="text-sm font-mono">
                          {item.originalCurrency !== targetCurrency ? (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className="space-y-1"
                            >
                              <div className="text-primary font-medium">
                                1 {item.originalCurrency} = {(1 / exchangeRates[item.originalCurrency])?.toFixed(4)} {targetCurrency}
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                                <span>{originalCurrency?.name}</span>
                                <motion.span
                                  animate={{ x: [0, 3, 0] }}
                                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                >
                                  →
                                </motion.span>
                                <span>{targetCurrencyData?.name}</span>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className="text-muted-foreground space-y-1"
                            >
                              <div>{t('currency.same_currency')}</div>
                              <div className="text-xs">{t('currency.no_conversion')}</div>
                            </motion.div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-right text-sm text-muted-foreground">
                        {formatDate(item.lastUpdated, 'en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>
                    </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {sortedPricing.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No pricing data available for this plan
          </div>
        )}

        {/* Average Price Summary */}
        {sortedPricing.length > 0 && (
          <motion.div 
            className="mt-6 p-4 bg-muted/50 rounded-lg border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-sm font-medium text-center mb-3 flex items-center justify-center gap-2">
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                📊
              </motion.span>
              {t('icloud.price_overview')}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-3 bg-background rounded-lg">
                <div className="text-muted-foreground mb-1">{t('icloud.average_monthly')}</div>
                <div className="text-lg font-bold text-primary">
                  {formatCurrency(averageMonthlyPrice, targetCurrency)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t('icloud.based_on')} {pricing.length} {t('icloud.countries')}
                </div>
              </div>

              {averageYearlyPrice > 0 && (
                <div className="text-center p-3 bg-background rounded-lg">
                  <div className="text-muted-foreground mb-1">{t('icloud.average_yearly')}</div>
                  <div className="text-lg font-bold text-primary">
                    {formatCurrency(averageYearlyPrice, targetCurrency)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t('icloud.based_on')} {yearlyPrices.length} {t('icloud.countries')}
                  </div>
                </div>
              )}

              <div className="text-center p-3 bg-background rounded-lg">
                <div className="text-muted-foreground mb-1">{t('icloud.price_difference')}</div>
                <div className="text-lg font-bold text-destructive">
                  {formatCurrency((sortedPricing[sortedPricing.length - 1]?.priceMonthly || 0) - (sortedPricing[0]?.priceMonthly || 0), targetCurrency)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t('icloud.highest_lowest')}
                </div>
              </div>
            </div>

            <div className="mt-3 text-xs text-center text-muted-foreground">
              💡 {t('icloud.region_tip')}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
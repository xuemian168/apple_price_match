import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import { Share2, Copy, Check, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { iCloudPricing, iCloudPlan } from '@/types';
import { getCountryByCode } from '@/data/countries';
import { getCurrencyByCode } from '@/data/currencies';
import { formatCurrency } from '@/lib/utils';

interface ShareButtonProps {
  plan: iCloudPlan;
  pricing: iCloudPricing[];
  targetCurrency: string;
  className?: string;
}

export function ShareButton({ plan, pricing, targetCurrency, className }: ShareButtonProps) {
  const { t } = useTranslation('common');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Calculate average price
  const averagePrice = pricing.length > 0 
    ? pricing.reduce((sum, item) => sum + item.priceMonthly, 0) / pricing.length 
    : 0;

  // Find lowest and highest prices
  const sortedByPrice = [...pricing].sort((a, b) => a.priceMonthly - b.priceMonthly);
  const lowestPrice = sortedByPrice[0];
  const highestPrice = sortedByPrice[sortedByPrice.length - 1];

  const generateShareText = (type: 'simple' | 'detailed' | 'wechat') => {
    const currencyData = getCurrencyByCode(targetCurrency);
    const currencySymbol = currencyData?.symbol || targetCurrency;

    if (type === 'simple') {
      return `🍎 ${t('share.content.title', { storage: plan.storage })}\n\n💰 ${t('share.content.average_price')}: ${formatCurrency(averagePrice, targetCurrency)}\n📍 ${t('share.content.lowest')}: ${getCountryByCode(lowestPrice?.country)?.name || lowestPrice?.country} ${formatCurrency(lowestPrice?.priceMonthly || 0, targetCurrency)}\n📍 ${t('share.content.highest')}: ${getCountryByCode(highestPrice?.country)?.name || highestPrice?.country} ${formatCurrency(highestPrice?.priceMonthly || 0, targetCurrency)}\n\n🔗 ${t('share.content.view_full')}: ${window.location.href}`;
    }

    if (type === 'wechat') {
      const monthlyDiff = (highestPrice?.priceMonthly || 0) - (lowestPrice?.priceMonthly || 0);
      return `🍎${t('share.content.wechat_title', { storage: plan.storage })}\n\n💡 ${t('share.content.wechat_intro')}\n\n💰 ${t('share.content.wechat_global_avg')}: ${currencySymbol}${averagePrice.toFixed(2)}/月\n🏆 ${t('share.content.wechat_cheapest')}: ${getCountryByCode(lowestPrice?.country)?.name || lowestPrice?.country} ${currencySymbol}${(lowestPrice?.priceMonthly || 0).toFixed(2)}\n💸 ${t('share.content.wechat_most_expensive')}: ${getCountryByCode(highestPrice?.country)?.name || highestPrice?.country} ${currencySymbol}${(highestPrice?.priceMonthly || 0).toFixed(2)}\n\n📊 ${t('share.content.wechat_monthly_diff')}: ${currencySymbol}${monthlyDiff.toFixed(2)}/月\n\n🔗 ${t('share.content.wechat_tool')}: ${window.location.href}\n\n${t('share.content.wechat_hashtags')}`;
    }

    // Detailed format
    const topCountries = sortedByPrice.slice(0, 5);
    let detailedText = `🍎 ${t('share.content.title', { storage: plan.storage })}\n\n`;
    detailedText += `📊 ${t('share.content.statistics')}:\n`;
    detailedText += `• ${t('share.content.average_price')}: ${formatCurrency(averagePrice, targetCurrency)}\n`;
    detailedText += `• ${t('share.content.price_range')}: ${formatCurrency(lowestPrice?.priceMonthly || 0, targetCurrency)} - ${formatCurrency(highestPrice?.priceMonthly || 0, targetCurrency)}\n`;
    detailedText += `• ${t('share.content.compared_countries')}: ${pricing.length}\n\n`;
    
    detailedText += `🏆 ${t('share.content.top_deals')}:\n`;
    topCountries.forEach((item, index) => {
      const country = getCountryByCode(item.country);
      detailedText += `${index + 1}. ${country?.flag} ${country?.name}: ${formatCurrency(item.priceMonthly, targetCurrency)}\n`;
    });

    detailedText += `\n🔗 ${t('share.content.view_full')}: ${window.location.href}`;
    detailedText += `\n\n💡 ${t('share.content.tip')}`;

    return detailedText;
  };

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(type);
      toast.success(t('share.copied'));
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      toast.error(t('share.copy_failed'));
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: t('share.content.title', { storage: plan.storage }),
          text: generateShareText('simple'),
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error occurred
        console.log('Share cancelled');
      }
    } else {
      // Fallback to copy
      await handleCopy(generateShareText('simple'), 'native');
    }
  };

  if (pricing.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`flex items-center gap-2 ${className}`}
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Share2 className="h-4 w-4" />
          </motion.div>
          {t('share.button')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <div className="p-3 space-y-2">
          <div className="text-sm font-medium">{t('share.title')}</div>
          <div className="text-xs text-muted-foreground">
            📊 {t('share.content.average_price')}: {formatCurrency(averagePrice, targetCurrency)}
          </div>
          <div className="text-xs text-muted-foreground">
            🏆 {t('share.content.lowest')}: {getCountryByCode(lowestPrice?.country)?.flag} {formatCurrency(lowestPrice?.priceMonthly || 0, targetCurrency)}
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <>
            <DropdownMenuItem onClick={handleNativeShare}>
              <Share2 className="mr-2 h-4 w-4" />
              {t('share.native')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        
        <DropdownMenuItem onClick={() => handleCopy(generateShareText('simple'), 'simple')}>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              {copiedText === 'simple' ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mr-2"
                >
                  <Check className="h-4 w-4 text-green-500" />
                </motion.div>
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              {t('share.simple')}
            </div>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleCopy(generateShareText('detailed'), 'detailed')}>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              {copiedText === 'detailed' ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mr-2"
                >
                  <Check className="h-4 w-4 text-green-500" />
                </motion.div>
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              {t('share.detailed')}
            </div>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleCopy(generateShareText('wechat'), 'wechat')}>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              {copiedText === 'wechat' ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mr-2"
                >
                  <Check className="h-4 w-4 text-green-500" />
                </motion.div>
              ) : (
                <MessageCircle className="mr-2 h-4 w-4" />
              )}
              {t('share.wechat')}
            </div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
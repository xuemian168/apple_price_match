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
      return `🍎 iCloud ${plan.storage} 全球价格对比\n\n💰 平均价格: ${formatCurrency(averagePrice, targetCurrency)}\n📍 最低: ${getCountryByCode(lowestPrice?.country)?.name || lowestPrice?.country} ${formatCurrency(lowestPrice?.priceMonthly || 0, targetCurrency)}\n📍 最高: ${getCountryByCode(highestPrice?.country)?.name || highestPrice?.country} ${formatCurrency(highestPrice?.priceMonthly || 0, targetCurrency)}\n\n🔗 查看完整对比: ${window.location.href}`;
    }

    if (type === 'wechat') {
      return `🍎【iCloud ${plan.storage} 全球价格大比拼】\n\n💡 发现好价！各国iCloud储存空间价格差异巨大：\n\n💰 全球平均价：${currencySymbol}${averagePrice.toFixed(2)}/月\n🏆 最便宜：${getCountryByCode(lowestPrice?.country)?.name || lowestPrice?.country} ${currencySymbol}${(lowestPrice?.priceMonthly || 0).toFixed(2)}\n💸 最贵：${getCountryByCode(highestPrice?.country)?.name || highestPrice?.country} ${currencySymbol}${(highestPrice?.priceMonthly || 0).toFixed(2)}\n\n📊 相差：${currencySymbol}${((highestPrice?.priceMonthly || 0) - (lowestPrice?.priceMonthly || 0)).toFixed(2)}/月\n\n🔗 完整价格对比工具：${window.location.href}\n\n#iCloud #苹果 #价格对比 #省钱攻略`;
    }

    // Detailed format
    const topCountries = sortedByPrice.slice(0, 5);
    let detailedText = `🍎 iCloud ${plan.storage} 全球价格详细对比\n\n`;
    detailedText += `📊 统计信息:\n`;
    detailedText += `• 平均价格: ${formatCurrency(averagePrice, targetCurrency)}\n`;
    detailedText += `• 价格区间: ${formatCurrency(lowestPrice?.priceMonthly || 0, targetCurrency)} - ${formatCurrency(highestPrice?.priceMonthly || 0, targetCurrency)}\n`;
    detailedText += `• 对比国家: ${pricing.length}个\n\n`;
    
    detailedText += `🏆 最优惠的5个国家/地区:\n`;
    topCountries.forEach((item, index) => {
      const country = getCountryByCode(item.country);
      detailedText += `${index + 1}. ${country?.flag} ${country?.name}: ${formatCurrency(item.priceMonthly, targetCurrency)}\n`;
    });

    detailedText += `\n🔗 完整对比工具: ${window.location.href}`;
    detailedText += `\n\n💡 提示: 通过切换Apple ID区域可能享受不同价格`;

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
          title: `iCloud ${plan.storage} 价格对比`,
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
            📊 平均价格: {formatCurrency(averagePrice, targetCurrency)}
          </div>
          <div className="text-xs text-muted-foreground">
            🏆 最低: {getCountryByCode(lowestPrice?.country)?.flag} {formatCurrency(lowestPrice?.priceMonthly || 0, targetCurrency)}
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
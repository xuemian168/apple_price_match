import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { currencies } from '@/data/currencies';
import { cn } from '@/lib/utils';

interface CurrencyCalculatorProps {
  exchangeRates: Record<string, number>;
  defaultFromCurrency?: string;
  className?: string;
}

export function CurrencyCalculator({
  exchangeRates,
  defaultFromCurrency = 'USD',
  className
}: CurrencyCalculatorProps) {
  const { t } = useTranslation('common');
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState<string>(defaultFromCurrency);
  const [toCurrency, setToCurrency] = useState<string>('USD');
  
  // Draggable button position state
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update from currency when default changes
  useEffect(() => {
    setFromCurrency(defaultFromCurrency);
  }, [defaultFromCurrency]);

  // Get available currencies from exchange rates
  const availableCurrencies = Object.keys(exchangeRates).filter(currency => 
    currencies.some(c => c.code === currency)
  );

  // Calculate exchange rate and result
  const calculateExchange = () => {
    const numAmount = parseFloat(amount) || 0;
    
    if (fromCurrency === toCurrency) {
      return {
        rate: 1,
        result: numAmount,
        rateText: '1:1'
      };
    }

    // Get rates (all rates are relative to USD)
    const fromRate = exchangeRates[fromCurrency] || 1;
    const toRate = exchangeRates[toCurrency] || 1;
    
    // Calculate the exchange rate between the two currencies
    let rate: number;
    if (fromCurrency === 'USD') {
      rate = toRate;
    } else if (toCurrency === 'USD') {
      rate = 1 / fromRate;
    } else {
      // Convert from source currency to USD, then to target currency
      rate = toRate / fromRate;
    }

    const result = numAmount * rate;
    
    return {
      rate,
      result,
      rateText: `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`
    };
  };

  const { rate, result, rateText } = calculateExchange();

  // Get currency info
  const fromCurrencyData = currencies.find(c => c.code === fromCurrency);
  const toCurrencyData = currencies.find(c => c.code === toCurrency);

  // Swap currencies
  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // Handle drag events
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Calculate drag constraints based on window size
  const getDragConstraints = () => {
    if (typeof window === 'undefined') return { top: 0, bottom: 0, left: 0, right: 0 };
    
    return {
      top: isMobile ? 16 : -window.innerHeight / 2 + 50,
      bottom: isMobile ? window.innerHeight - 80 : window.innerHeight / 2 - 50,
      left: -window.innerWidth + 100,
      right: 50,
    };
  };

  return (
    <>
      {/* Mobile overlay with animation */}
      <AnimatePresence>
        {!isCollapsed && isMobile && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setIsCollapsed(true)}
          />
        )}
      </AnimatePresence>
      
      {/* Toggle button with enhanced styling - Now draggable */}
      <motion.div 
        className={cn("fixed z-50", isDragging ? "cursor-grabbing" : "cursor-grab")}
        style={{
          top: isMobile ? '1rem' : '50%',
          right: '1rem',
          transform: isMobile ? 'none' : 'translateY(-50%)',
        }}
        drag
        dragMomentum={false}
        dragElastic={0.1}
        dragConstraints={getDragConstraints()}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        animate={!isDragging ? {
          x: isCollapsed ? 0 : -4,
          scale: isCollapsed ? 1 : 0.95,
        } : {}}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        whileHover={!isDragging ? { scale: 1.05 } : {}}
        whileTap={!isDragging ? { scale: 0.95 } : {}}
        initial={{ x: 0, y: 0 }}
      >
        <motion.button
          onClick={() => !isDragging && setIsCollapsed(!isCollapsed)}
          className={cn(
            "relative rounded-full w-12 h-12 shadow-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center overflow-hidden group hover:shadow-2xl",
            isDragging ? "cursor-grabbing" : "cursor-pointer"
          )}
          aria-label={isCollapsed ? t('calculator.open') : t('calculator.close')}
          whileHover={!isDragging ? { 
            boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)",
          } : {}}
          animate={isDragging ? {
            scale: 1.1,
            boxShadow: "0 25px 50px rgba(59, 130, 246, 0.4)",
          } : {}}
        >
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100"
            initial={{ scale: 0 }}
            whileHover={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Icon with smooth transitions */}
          <AnimatePresence mode="wait">
            {isCollapsed ? (
              <motion.div
                key="calculator"
                initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 180, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="relative z-10"
              >
                <Icons.Calculator className="h-5 w-5" />
              </motion.div>
            ) : (
              <motion.div
                key="close"
                initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 180, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="relative z-10"
              >
                <Icons.X className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Pulse effect - Enhanced for drag indication */}
          <motion.div
            className="absolute inset-0 rounded-full bg-white/20"
            animate={isCollapsed && !isDragging ? { scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Drag indicator ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white/30"
            animate={isDragging ? { 
              scale: [1, 1.3, 1], 
              opacity: [0.5, 0.2, 0.5],
              rotate: [0, 180, 360] 
            } : { opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.button>
      </motion.div>

      {/* Calculator Panel with enhanced styling */}
      <motion.div 
        className={cn(
          "fixed z-40 bg-gradient-to-br from-background via-background to-muted/20 border shadow-2xl backdrop-blur-md",
          isMobile
            ? "top-0 right-0 bottom-0 w-80 border-l"
            : "top-4 right-4 bottom-4 w-80 rounded-2xl border",
          className
        )}
        initial={{ x: "100%", opacity: 0 }}
        animate={{ 
          x: isCollapsed ? "100%" : "0%", 
          opacity: isCollapsed ? 0 : 1,
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        {/* Glass effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl" />
        
        <div className="relative h-full p-4 overflow-y-auto">
          {/* Header with gradient text */}
          <motion.div 
            className="pb-3 border-b border-border/50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.h3 
              className="flex items-center gap-2 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-blue-500"
              >
                <Icons.Calculator className="h-5 w-5" />
              </motion.div>
              {t('calculator.title')}
            </motion.h3>
          </motion.div>
          
          <motion.div 
            className="space-y-4 pt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, staggerChildren: 0.1 }}
          >
            {/* Amount Input */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  💰
                </motion.div>
                {t('calculator.amount')}
              </label>
              <motion.input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100"
                className="w-full p-3 border-2 border-border/50 rounded-lg text-right text-lg font-mono bg-background/50 backdrop-blur-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 hover:border-border/80"
                whileFocus={{ scale: 1.01 }}
              />
            </motion.div>

            {/* From Currency */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  🌍
                </motion.div>
                {t('calculator.from_currency')}
              </label>
              <motion.select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full p-2 border-2 border-border/50 rounded-lg bg-background/50 backdrop-blur-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 hover:border-border/80 font-medium text-sm"
                whileFocus={{ scale: 1.01 }}
              >
                {availableCurrencies.map((currency) => {
                  const currencyData = currencies.find(c => c.code === currency);
                  return (
                    <option key={currency} value={currency}>
                      {currency} - {currencyData?.name}
                    </option>
                  );
                })}
              </motion.select>
            </motion.div>

            {/* Swap Button */}
            <motion.div 
              className="flex justify-center py-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.button
                onClick={handleSwap}
                className="relative rounded-full w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-500 text-white flex items-center justify-center shadow-lg hover:shadow-xl group overflow-hidden"
                aria-label={t('calculator.swap')}
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", damping: 15, stiffness: 300 }}
              >
                {/* Ripple effect */}
                <motion.div
                  className="absolute inset-0 bg-white/30 rounded-full"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="relative z-10"
                >
                  <Icons.ArrowUpDown className="h-5 w-5" />
                </motion.div>
              </motion.button>
            </motion.div>

            {/* To Currency */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  🎯
                </motion.div>
                {t('calculator.to_currency')}
              </label>
              <motion.select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full p-2 border-2 border-border/50 rounded-lg bg-background/50 backdrop-blur-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 hover:border-border/80 font-medium text-sm"
                whileFocus={{ scale: 1.01 }}
              >
                {availableCurrencies.map((currency) => {
                  const currencyData = currencies.find(c => c.code === currency);
                  return (
                    <option key={currency} value={currency}>
                      {currency} - {currencyData?.name}
                    </option>
                  );
                })}
              </motion.select>
            </motion.div>

            {/* Exchange Rate */}
            <motion.div 
              className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg border border-blue-200/30 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  💱
                </motion.div>
                {t('calculator.exchange_rate')}
              </div>
              <div className="font-mono text-sm font-bold text-blue-800 dark:text-blue-300 transition-all duration-200">
                {rateText}
              </div>
            </motion.div>

            {/* Result */}
            <motion.div 
              className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg border-2 border-green-200/50 shadow-lg backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            >
              <div className="text-xs font-medium text-green-600 dark:text-green-400 mb-2 flex items-center gap-1">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✨
                </motion.div>
                {t('calculator.result')}
              </div>
              <div className="text-2xl font-mono font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2 transition-all duration-200">
                {toCurrencyData?.symbol}{result.toFixed(2)}
              </div>
              <div className="text-xs text-green-700 dark:text-green-300 bg-white/30 dark:bg-black/20 rounded-lg p-2 backdrop-blur-sm transition-all duration-200">
                {parseFloat(amount).toFixed(2)} {fromCurrency} → {result.toFixed(2)} {toCurrency}
              </div>
            </motion.div>

            {/* Quick Amount Buttons */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1">
                <motion.div
                  animate={{ bounce: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ⚡
                </motion.div>
                {t('calculator.quick_amounts')}
              </label>
              <motion.div 
                className="grid grid-cols-4 gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, staggerChildren: 0.1 }}
              >
                {['1', '10', '100', '1000'].map((quickAmount, index) => (
                  <motion.button
                    key={quickAmount}
                    onClick={() => setAmount(quickAmount)}
                    className={`relative p-2 rounded-lg font-bold text-xs transition-all duration-300 overflow-hidden ${
                      amount === quickAmount 
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg scale-105" 
                        : "bg-background/50 border-2 border-border/30 hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/30"
                    }`}
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    {/* Shine effect */}
                    {amount === quickAmount && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                      />
                    )}
                    
                    <span className="relative z-10">{quickAmount}</span>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
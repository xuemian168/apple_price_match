import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import { Apple, Globe, Sparkles, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MobileMenuButton } from './MobileMenu';
import { DesktopNavigation } from './DesktopNavigation';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
];

export function Header({ className }: HeaderProps) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { pathname, asPath, query, locale } = router;
  const [scrolled, setScrolled] = useState(false);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = (newLocale: string) => {
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };


  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300",
        scrolled 
          ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-xl border-b border-slate-300/60 dark:border-slate-600/60" 
          : "bg-white/20 dark:bg-slate-900/20 backdrop-blur-lg",
        className
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex h-full items-center justify-between">
          {/* Logo with enhanced styling */}
          <Link href="/" className="group flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300"
            >
              <Apple className="h-6 w-6 text-white" />
              
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300" />
              
              {/* Sparkle effect */}
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ 
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="h-3 w-3 text-yellow-400" />
              </motion.div>
            </motion.div>
            
            <div className="hidden sm:block">
              <motion.h1 
                className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent"
                whileHover={{ scale: 1.02 }}
              >
                {t('site.title')}
              </motion.h1>
              <motion.p 
                className="text-xs text-slate-600 dark:text-slate-400 hidden lg:block"
                initial={{ opacity: 0.7 }}
                whileHover={{ opacity: 1 }}
              >
                {t('site.tagline')}
              </motion.p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <DesktopNavigation />

          {/* Right side controls */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Select value={locale} onValueChange={changeLanguage}>
                <SelectTrigger className="w-auto border-0 bg-white/50 dark:bg-slate-800/60 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-200 rounded-full border border-white/30 dark:border-slate-600/40">
                  <SelectValue>
                    <div className="flex items-center gap-2 px-2">
                      <Globe className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                      <span className="text-lg">{currentLanguage.flag}</span>
                      <span className="hidden lg:inline text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {currentLanguage.name}
                      </span>
                      <ChevronDown className="h-3 w-3 text-slate-600 dark:text-slate-400" />
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/20 shadow-2xl rounded-2xl">
                  {languages.map((language) => (
                    <SelectItem 
                      key={language.code} 
                      value={language.code}
                      className="rounded-xl hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{language.flag}</span>
                        <span className="font-medium">{language.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            {/* Mobile Menu Button */}
            <MobileMenuButton />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
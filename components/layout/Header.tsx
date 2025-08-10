import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import { Apple, Globe, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

  const changeLanguage = (newLocale: string) => {
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  const navItems = [
    { href: '/', label: t('navigation.home') },
    { href: '/icloud', label: t('navigation.icloud') },
    { href: '/devices', label: t('navigation.devices') },
    { href: '/about', label: t('navigation.about') },
  ];

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  return (
    <header className={cn("border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <motion.div
              whileHover={{ rotate: 5 }}
              className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg"
            >
              <Apple className="h-5 w-5 text-primary-foreground" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold">{t('site.title')}</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {t('site.tagline')}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={router.pathname === item.href ? "secondary" : "ghost"}
                  size="sm"
                  className="relative"
                >
                  {item.label}
                  {router.pathname === item.href && (
                    <motion.div
                      className="absolute inset-0 bg-secondary rounded-md -z-10"
                      layoutId="activeNavItem"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <Select value={locale} onValueChange={changeLanguage}>
              <SelectTrigger className="w-auto border-none shadow-none">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span className="hidden sm:inline">{currentLanguage.flag}</span>
                    <span className="hidden lg:inline">{currentLanguage.name}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {languages.map((language) => (
                  <SelectItem key={language.code} value={language.code}>
                    <div className="flex items-center gap-2">
                      <span>{language.flag}</span>
                      <span>{language.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden border-t py-2">
          <div className="flex flex-wrap gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={router.pathname === item.href ? "secondary" : "ghost"}
                  size="sm"
                  className="text-xs"
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
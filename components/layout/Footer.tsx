import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import { Apple, Github, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const { t } = useTranslation('common');
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { href: '/about', label: t('navigation.about') },
    { href: '/icloud', label: t('navigation.icloud') },
    { href: '/devices', label: t('navigation.devices') },
  ];

  return (
    <footer className={cn("border-t bg-muted/30", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <motion.div
                whileHover={{ rotate: 5 }}
                className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg"
              >
                <Apple className="h-5 w-5 text-primary-foreground" />
              </motion.div>
              <div>
                <h3 className="font-bold text-lg">{t('site.title')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('site.tagline')}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('site.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Section */}
          <div className="space-y-4">
            <h4 className="font-semibold">Information</h4>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                Compare Apple products and services pricing across different countries.
              </p>
              <p>
                Exchange rates are updated regularly for accurate comparisons.
              </p>
              <div className="flex items-center gap-1">
                <span>Made with</span>
                <Heart className="h-4 w-4 text-red-500" />
                <span>for Apple enthusiasts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t pt-6 mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © {currentYear} <Link href="https://www.ict.run/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">ICT.RUN</Link>. All rights reserved.
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-xs text-muted-foreground">
                Prices may vary. Check official Apple stores for current pricing.
              </div>
              
              <Link
                href="https://github.com/xuemian168/apple_price_match"
                className="text-muted-foreground hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub repository"
              >
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './Header';
import { Footer } from './Footer';
import { Breadcrumbs } from './Breadcrumbs';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
  canonical?: string;
  className?: string;
  jsonLD?: object;
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const pageTransition = {
  duration: 0.3,
  ease: [0.25, 0.46, 0.45, 0.94],
};

export function Layout({ 
  children, 
  title, 
  description, 
  keywords = [],
  image,
  type = 'website',
  noindex = false,
  canonical,
  className,
  jsonLD 
}: LayoutProps) {
  const { t } = useTranslation('common');
  const router = useRouter();
  
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://apple-price-match.com';
  const currentUrl = `${baseUrl}${router.asPath}`;
  
  const pageTitle = title 
    ? `${title} | ${t('site.title')}` 
    : t('site.title');
  
  const pageDescription = description || t('site.description');
  const pageImage = image || `${baseUrl}/og-image.png`;
  const canonicalUrl = canonical || currentUrl;
  
  const defaultKeywords = [
    'Apple pricing', 'iCloud storage', 'price comparison', 'Apple devices',
    'international pricing', 'currency conversion', 'best Apple deals'
  ];
  const pageKeywords = [...defaultKeywords, ...keywords].join(', ');

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* SEO Meta Tags */}
        {noindex && <meta name="robots" content="noindex, nofollow" />}
        <meta name="author" content="Apple Price Match" />
        <meta name="language" content={router.locale || 'en'} />
        
        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content={type} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:image:alt" content={pageTitle} />
        <meta property="og:site_name" content={t('site.title')} />
        <meta property="og:locale" content={router.locale || 'en'} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
        <meta name="twitter:url" content={canonicalUrl} />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        
        {/* Theme */}
        <meta name="theme-color" content="#007AFF" />
        <meta name="color-scheme" content="light dark" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={t('site.title')} />
        
        {/* Alternative Languages (hreflang) */}
        <link rel="alternate" hrefLang="en" href={`${baseUrl}${router.asPath}`} />
        <link rel="alternate" hrefLang="zh" href={`${baseUrl}/zh${router.asPath}`} />
        <link rel="alternate" hrefLang="ja" href={`${baseUrl}/ja${router.asPath}`} />
        <link rel="alternate" hrefLang="ko" href={`${baseUrl}/ko${router.asPath}`} />
        <link rel="alternate" hrefLang="es" href={`${baseUrl}/es${router.asPath}`} />
        <link rel="alternate" hrefLang="fr" href={`${baseUrl}/fr${router.asPath}`} />
        <link rel="alternate" hrefLang="de" href={`${baseUrl}/de${router.asPath}`} />
        <link rel="alternate" hrefLang="x-default" href={`${baseUrl}${router.asPath}`} />
        
        {/* JSON-LD Structured Data */}
        {jsonLD && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD) }}
          />
        )}
      </Head>

      <div className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <Header />
          
          <main className={cn("flex-1", className)}>
            <div className="container mx-auto px-4 pt-4">
              <Breadcrumbs />
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key="page-content"
                initial="initial"
                animate="enter"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
          
          <Footer />
        </div>
      </div>
    </>
  );
}
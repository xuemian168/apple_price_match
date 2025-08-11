import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
  canonical?: string;
}

export function useSEO() {
  const { t } = useTranslation('common');
  const router = useRouter();

  const generateSEO = (config: SEOConfig = {}) => {
    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://apple-price-match.com';
    const currentUrl = `${baseUrl}${router.asPath}`;
    
    const siteTitle = t('site.title');
    const siteDescription = t('site.description');
    
    const seo = {
      title: config.title ? `${config.title} | ${siteTitle}` : siteTitle,
      description: config.description || siteDescription,
      keywords: config.keywords || [
        'Apple pricing',
        'iCloud storage',
        'price comparison',
        'Apple devices',
        'international pricing',
        'currency conversion',
        'best Apple deals'
      ],
      image: config.image || `${baseUrl}/og-image.png`,
      url: config.url || currentUrl,
      canonical: config.canonical || currentUrl,
      type: config.type || 'website',
      noindex: config.noindex || false,
    };

    return seo;
  };

  const generateJSONLD = (type: 'WebApplication' | 'Organization' | 'Product', data?: any) => {
    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://apple-price-match.com';
    
    const commonData = {
      '@context': 'https://schema.org',
      '@type': type,
    };

    switch (type) {
      case 'WebApplication':
        return {
          ...commonData,
          name: t('site.title'),
          description: t('site.description'),
          url: baseUrl,
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'Web',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD'
          },
          author: {
            '@type': 'Organization',
            name: 'Apple Price Match',
            url: baseUrl
          }
        };

      case 'Organization':
        return {
          ...commonData,
          name: 'Apple Price Match',
          description: t('site.description'),
          url: baseUrl,
          logo: `${baseUrl}/logo.png`,
          sameAs: [
            // Add social media URLs when available
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            areaServed: 'Worldwide',
            availableLanguage: ['English', 'Chinese', 'Japanese', 'Korean', 'Spanish', 'French', 'German']
          }
        };

      case 'Product':
        return {
          ...commonData,
          name: data?.name || 'Apple Price Comparison',
          description: data?.description || t('site.description'),
          brand: {
            '@type': 'Brand',
            name: 'Apple'
          },
          category: 'Software Application',
          offers: {
            '@type': 'AggregateOffer',
            lowPrice: data?.lowPrice || '0',
            highPrice: data?.highPrice || '1000',
            priceCurrency: data?.currency || 'USD'
          }
        };

      default:
        return commonData;
    }
  };

  return {
    generateSEO,
    generateJSONLD
  };
}
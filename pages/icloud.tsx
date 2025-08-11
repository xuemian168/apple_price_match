import React from 'react';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { iCloudComparison as ICloudComparison } from '@/components/pricing/iCloudComparison';
import { PageLayout } from '@/components/layout/PageLayout';
import { useSEO } from '@/hooks/useSEO';

export default function iCloudPage() {
  const { t } = useTranslation('common');
  const { generateJSONLD } = useSEO();

  // Generate structured data for iCloud pricing
  const productData = generateJSONLD('Product', {
    name: 'iCloud Storage Plans',
    description: t('icloud.description'),
    lowPrice: '0.99',
    highPrice: '59.99',
    currency: 'USD'
  });

  return (
    <PageLayout
      title={t('icloud.title')}
      description={t('icloud.description')}
      keywords={[
        'iCloud storage pricing',
        'iCloud plans comparison',
        'Apple iCloud cost',
        'iCloud storage deals',
        'international iCloud pricing',
        'best iCloud plan',
        '50GB 200GB 2TB iCloud'
      ]}
      type="product"
      jsonLD={productData}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Page Title Section */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold">
              {t('icloud.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('icloud.description')}
            </p>
          </div>

          {/* iCloud Comparison Component */}
          <div>
            <ICloudComparison />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  };
};
import React from 'react';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Globe, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { useSEO } from '@/hooks/useSEO';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const { t } = useTranslation('common');
  const { generateJSONLD } = useSEO();

  const features = [
    {
      icon: Globe,
      title: t('homepage.features.global_comparison.title'),
      description: t('homepage.features.global_comparison.description'),
    },
    {
      icon: TrendingUp,
      title: t('homepage.features.real_time_rates.title'),
      description: t('homepage.features.real_time_rates.description'),
    },
    {
      icon: Zap,
      title: t('homepage.features.fast_responsive.title'),
      description: t('homepage.features.fast_responsive.description'),
    },
  ];

  // Generate structured data for homepage
  const organizationData = generateJSONLD('Organization');
  const webApplicationData = generateJSONLD('WebApplication');
  
  const combinedJSONLD = {
    '@context': 'https://schema.org',
    '@graph': [organizationData, webApplicationData]
  };

  return (
    <Layout 
      title={t('site.tagline')}
      description={t('site.description')}
      keywords={[
        'Apple price comparison',
        'iCloud pricing',
        'global Apple deals',
        'currency converter',
        'Apple device prices',
        'international shopping'
      ]}
      jsonLD={combinedJSONLD}
    >
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center space-y-6 py-12"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight"
        >
          {t('site.title')}
        </motion.h1>
        
        <motion.p
          variants={itemVariants}
          className="text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          {t('site.description')}
        </motion.p>
        
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/icloud">
            <Button size="lg" className="group">
              {t('homepage.hero.cta_icloud')}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          
          <Link href="/devices">
            <Button size="lg" variant="outline">
              {t('homepage.hero.cta_devices')}
            </Button>
          </Link>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        <motion.div variants={itemVariants} className="text-center space-y-2">
          <h2 className="text-3xl font-bold">{t('homepage.features.title')}</h2>
          <p className="text-muted-foreground">
            {t('homepage.features.subtitle')}
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card className="text-center h-full">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Quick Links Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        <motion.div variants={itemVariants} className="text-center space-y-2">
          <h2 className="text-3xl font-bold">{t('homepage.quick_links.title')}</h2>
          <p className="text-muted-foreground">
            {t('homepage.quick_links.subtitle')}
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <Link href="/icloud" className="block">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {t('homepage.quick_links.icloud.title')}
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </CardTitle>
                  <CardDescription>
                    {t('homepage.quick_links.icloud.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t('homepage.quick_links.icloud.plans')}</span>
                      <span className="text-muted-foreground">{t('homepage.quick_links.icloud.plans_range')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{t('homepage.quick_links.icloud.countries')}</span>
                      <span className="text-muted-foreground">{t('homepage.quick_links.icloud.countries_count')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{t('homepage.quick_links.icloud.exchange_rates')}</span>
                      <span className="text-muted-foreground">{t('homepage.quick_links.icloud.live_data')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Link href="/devices" className="block">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group opacity-75">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {t('homepage.quick_links.devices.title')}
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      {t('homepage.quick_links.devices.coming_soon')}
                    </span>
                  </CardTitle>
                  <CardDescription>
                    {t('homepage.quick_links.devices.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t('homepage.quick_links.devices.device_types')}</span>
                      <span className="text-muted-foreground">{t('homepage.quick_links.devices.device_list')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{t('homepage.quick_links.devices.status')}</span>
                      <span className="text-muted-foreground">{t('homepage.quick_links.devices.under_development')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Data Sources Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 pt-12 border-t"
      >
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <h3 className="text-xl font-semibold">{t('homepage.data_sources.title')}</h3>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">{t('homepage.data_sources.pricing_data.title')}</h4>
                <p>{t('homepage.data_sources.pricing_data.description')}</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">{t('homepage.data_sources.exchange_rates.title')}</h4>
                <p>
                  {t('homepage.data_sources.exchange_rates.description').split('ExchangeRate-API.com')[0]}
                  <a href="https://exchangerate-api.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    ExchangeRate-API.com
                  </a>
                  {t('homepage.data_sources.exchange_rates.description').split('ExchangeRate-API.com')[1]}
                </p>
              </div>
            </div>
            <div className="mt-6 text-xs text-muted-foreground">
              <p>{t('homepage.data_sources.disclaimer')}</p>
            </div>
          </div>
        </motion.div>
      </motion.section>
    </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  };
};
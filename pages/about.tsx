import React from 'react';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { motion } from 'framer-motion';
import { Target, Users, Zap, Heart } from 'lucide-react';
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

export default function AboutPage() {
  const { t } = useTranslation('common');
  const { generateJSONLD } = useSEO();

  const values = [
    {
      icon: Target,
      title: t('about.values.accuracy.title'),
      description: t('about.values.accuracy.description'),
    },
    {
      icon: Users,
      title: t('about.values.user_friendly.title'),
      description: t('about.values.user_friendly.description'),
    },
    {
      icon: Zap,
      title: t('about.values.performance.title'),
      description: t('about.values.performance.description'),
    },
    {
      icon: Heart,
      title: t('about.values.community.title'),
      description: t('about.values.community.description'),
    },
  ];

  // Generate structured data for about page
  const aboutData = generateJSONLD('Organization', {
    description: t('about.subtitle')
  });

  return (
    <Layout
      title={t('about.title')}
      description={t('about.subtitle')}
      keywords={[
        'about Apple Price Match',
        'company mission',
        'price comparison service',
        'Apple products',
        'international pricing',
        'technology stack'
      ]}
      jsonLD={aboutData}
    >
      <div className="container mx-auto px-4 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-12"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold">
            {t('about.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t('about.subtitle')}
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.section variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{t('about.mission.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg">
                {t('about.mission.description')}
              </p>
              <p>
                {t('about.mission.details')}
              </p>
            </CardContent>
          </Card>
        </motion.section>

        {/* Values Section */}
        <motion.section variants={itemVariants} className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">{t('about.values.title')}</h2>
            <p className="text-muted-foreground">
              {t('about.values.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{t('about.features.title')}</CardTitle>
              <CardDescription>
                {t('about.features.subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-600">{t('about.features.available.title')}</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>{t('about.features.available.icloud')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>{t('about.features.available.rates')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>{t('about.features.available.languages')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>{t('about.features.available.responsive')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>{t('about.features.available.animations')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>{t('about.features.available.sorting')}</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-600">{t('about.features.coming_soon.title')}</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>{t('about.features.coming_soon.devices')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>{t('about.features.coming_soon.history')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>{t('about.features.coming_soon.alerts')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>{t('about.features.coming_soon.api')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Technical Details */}
        <motion.section variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{t('about.technical.title')}</CardTitle>
              <CardDescription>
                {t('about.technical.subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <div className="font-semibold">{t('about.technical.nextjs')}</div>
                  <div className="text-sm text-muted-foreground">{t('about.technical.nextjs_desc')}</div>
                </div>
                <div className="space-y-2">
                  <div className="font-semibold">{t('about.technical.typescript')}</div>
                  <div className="text-sm text-muted-foreground">{t('about.technical.typescript_desc')}</div>
                </div>
                <div className="space-y-2">
                  <div className="font-semibold">{t('about.technical.tailwind')}</div>
                  <div className="text-sm text-muted-foreground">{t('about.technical.tailwind_desc')}</div>
                </div>
                <div className="space-y-2">
                  <div className="font-semibold">{t('about.technical.framer')}</div>
                  <div className="text-sm text-muted-foreground">{t('about.technical.framer_desc')}</div>
                </div>
                <div className="space-y-2">
                  <div className="font-semibold">{t('about.technical.shadcn')}</div>
                  <div className="text-sm text-muted-foreground">{t('about.technical.shadcn_desc')}</div>
                </div>
                <div className="space-y-2">
                  <div className="font-semibold">{t('about.technical.i18n')}</div>
                  <div className="text-sm text-muted-foreground">{t('about.technical.i18n_desc')}</div>
                </div>
              </div>
              
              <p className="text-muted-foreground">
                {t('about.technical.description')}
              </p>
            </CardContent>
          </Card>
        </motion.section>

        {/* Disclaimer */}
        <motion.section variants={itemVariants}>
          <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
            <CardHeader>
              <CardTitle className="text-xl text-yellow-800 dark:text-yellow-200">
                {t('about.disclaimer.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-700 dark:text-yellow-300">
                {t('about.disclaimer.content')}
              </p>
            </CardContent>
          </Card>
        </motion.section>
      </motion.div>
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
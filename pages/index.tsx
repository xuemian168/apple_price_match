import React from 'react';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Globe, Zap, Star, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageLayout } from '@/components/layout/PageLayout';
import { useSEO } from '@/hooks/useSEO';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
};

const floatingVariants = {
  animate: {
    y: [0, -10, 0],
    rotate: [0, 2, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
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
    <PageLayout 
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
      showBreadcrumbs={false}
    >
    {/* Background Elements */}
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
      
      {/* Floating gradient orbs */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
      />
      <motion.div
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: '2s' }}
        className="absolute top-40 -right-20 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full blur-3xl"
      />
      <motion.div
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: '4s' }}
        className="absolute bottom-20 left-1/3 w-64 h-64 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl"
      />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black,transparent)]" />
    </div>

    <div className="relative z-10">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center space-y-12"
        >
          {/* Main heading with glassmorphism */}
          <motion.div
            variants={itemVariants}
            className="space-y-6"
          >
            <div className="relative">
              <motion.h1
                className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                {t('site.title')}
              </motion.h1>
              
              {/* Floating sparkles */}
              <motion.div
                className="absolute -top-4 -right-4 text-2xl"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                ✨
              </motion.div>
              <motion.div
                className="absolute top-8 -left-8 text-xl"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                💫
              </motion.div>
            </div>
            
            <motion.p
              variants={itemVariants}
              className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium"
            >
              {t('site.description')}
            </motion.p>
          </motion.div>
          
          {/* CTA Buttons with enhanced styling */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link href="/icloud">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button 
                  size="lg" 
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-xl hover:shadow-2xl px-8 py-6 text-lg font-semibold"
                >
                  <span className="relative z-10 flex items-center">
                    {t('homepage.hero.cta_icloud')}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </Button>
              </motion.div>
            </Link>
            
            <Link href="/devices">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button 
                  size="lg" 
                  variant="outline"
                  className="group relative backdrop-blur-sm border-2 border-slate-300 dark:border-slate-600 bg-white/10 hover:bg-white/20 px-8 py-6 text-lg font-semibold"
                >
                  <span className="flex items-center">
                    {t('homepage.hero.cta_devices')}
                    <Sparkles className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  </span>
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-16"
        >
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              {t('homepage.features.title')}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {t('homepage.features.subtitle')}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="group"
              >
                <div className="relative h-full">
                  {/* Glass card with beautiful styling */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl rounded-3xl shadow-2xl group-hover:shadow-3xl transition-all duration-500" />
                  
                  {/* Content */}
                  <div className="relative z-10 p-8 text-center h-full flex flex-col">
                    {/* Icon with gradient background */}
                    <div className="mx-auto mb-6 relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
                    </div>
                    
                    <CardTitle className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">
                      {feature.title}
                    </CardTitle>
                    
                    <CardDescription className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed flex-1">
                      {feature.description}
                    </CardDescription>
                  </div>
                  
                  {/* Animated border */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Quick Links Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-16"
        >
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              {t('homepage.quick_links.title')}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {t('homepage.quick_links.subtitle')}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* iCloud Link Card */}
            <motion.div variants={itemVariants} className="group">
              <Link href="/icloud" className="block">
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="relative h-full overflow-hidden rounded-3xl"
                >
                  {/* Background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-600 opacity-90" />
                  
                  {/* Glass overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm" />
                  
                  {/* Content */}
                  <div className="relative z-10 p-8 text-white h-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold">{t('homepage.quick_links.icloud.title')}</h3>
                      <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                    </div>
                    
                    <p className="text-blue-100 mb-8 text-lg leading-relaxed">
                      {t('homepage.quick_links.icloud.description')}
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                        <span className="font-medium">{t('homepage.quick_links.icloud.plans')}</span>
                        <span className="text-blue-200">{t('homepage.quick_links.icloud.plans_range')}</span>
                      </div>
                      <div className="flex justify-between text-sm bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                        <span className="font-medium">{t('homepage.quick_links.icloud.countries')}</span>
                        <span className="text-blue-200">{t('homepage.quick_links.icloud.countries_count')}</span>
                      </div>
                      <div className="flex justify-between text-sm bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                        <span className="font-medium">{t('homepage.quick_links.icloud.exchange_rates')}</span>
                        <span className="text-blue-200">{t('homepage.quick_links.icloud.live_data')}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
                  <div className="absolute bottom-4 left-4 w-16 h-16 bg-cyan-400/20 rounded-full blur-2xl" />
                </motion.div>
              </Link>
            </motion.div>
            
            {/* Devices Link Card */}
            <motion.div variants={itemVariants} className="group">
              <Link href="/devices" className="block">
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="relative h-full overflow-hidden rounded-3xl"
                >
                  {/* Background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 opacity-75" />
                  
                  {/* Glass overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm" />
                  
                  {/* Content */}
                  <div className="relative z-10 p-8 text-white h-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold">{t('homepage.quick_links.devices.title')}</h3>
                      <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-3 py-1 rounded-full font-semibold">
                        {t('homepage.quick_links.devices.coming_soon')}
                      </span>
                    </div>
                    
                    <p className="text-purple-100 mb-8 text-lg leading-relaxed">
                      {t('homepage.quick_links.devices.description')}
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                        <span className="font-medium">{t('homepage.quick_links.devices.device_types')}</span>
                        <span className="text-purple-200">{t('homepage.quick_links.devices.device_list')}</span>
                      </div>
                      <div className="flex justify-between text-sm bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                        <span className="font-medium">{t('homepage.quick_links.devices.status')}</span>
                        <span className="text-purple-200">{t('homepage.quick_links.devices.under_development')}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
                  <div className="absolute bottom-4 left-4 w-16 h-16 bg-pink-400/20 rounded-full blur-2xl" />
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Data Sources Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-12"
        >
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <h3 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              {t('homepage.data_sources.title')}
            </h3>
          </motion.div>
          
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Pricing Data Card */}
              <motion.div variants={itemVariants} className="group">
                <div className="relative h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-300" />
                  
                  <div className="relative z-10 p-8">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                        <Shield className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-800 dark:text-white">
                        {t('homepage.data_sources.pricing_data.title')}
                      </h4>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {t('homepage.data_sources.pricing_data.description')}
                    </p>
                  </div>
                </div>
              </motion.div>
              
              {/* Exchange Rates Card */}
              <motion.div variants={itemVariants} className="group">
                <div className="relative h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-300" />
                  
                  <div className="relative z-10 p-8">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-800 dark:text-white">
                        {t('homepage.data_sources.exchange_rates.title')}
                      </h4>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {t('homepage.data_sources.exchange_rates.description').split('ExchangeRate-API.com')[0]}
                      <a 
                        href="https://exchangerate-api.com" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                      >
                        ExchangeRate-API.com
                      </a>
                      {t('homepage.data_sources.exchange_rates.description').split('ExchangeRate-API.com')[1]}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Disclaimer */}
            <motion.div 
              variants={itemVariants}
              className="mt-12 text-center"
            >
              <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t('homepage.data_sources.disclaimer')}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
      
      {/* Final decorative section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="flex justify-center space-x-2 text-4xl">
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0 }}
              >
                🍎
              </motion.span>
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                💰
              </motion.span>
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                🌍
              </motion.span>
            </div>
            
            <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">
              Start comparing and save money today
            </p>
          </motion.div>
        </div>
      </section>
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
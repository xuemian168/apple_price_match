module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh', 'ja', 'ko', 'es', 'fr', 'de'],
    localeDetection: true,
  },
  fallbackLng: {
    default: ['en'],
  },
  debug: false,
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh', 'ja', 'ko', 'es', 'fr', 'de'],
    localeDetection: true,
    // Explicitly enable browser language detection with Accept-Language header
    localePath: './public/locales',
    domains: [
      {
        domain: 'localhost',
        defaultLocale: 'en',
      },
    ],
  },
  fallbackLng: {
    default: ['en'],
    // WeChat 浏览器默认使用中文
    'zh-CN': ['zh', 'en'],
    'zh-TW': ['zh', 'en'],
  },
  // Enhanced locale detection configuration
  detection: {
    // 自定义检测顺序，优先检测 WeChat 浏览器
    order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
    // Cache the detected language
    caches: ['localStorage', 'cookie'],
    // 不检测子域名中的语言
    excludeCacheFor: ['cimode'],
  },
  debug: false,
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
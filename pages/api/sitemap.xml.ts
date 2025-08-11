import { NextApiRequest, NextApiResponse } from 'next';

const DOMAIN = process.env.DOMAIN || 'https://apple-price-match.com';

// Supported languages from next-i18next config
const LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'fr', 'de'];

// Main pages of the application
const PAGES = [
  '',          // Home page
  '/icloud',   // iCloud pricing page
  '/devices',  // Devices page (even if placeholder)
  '/about',    // About page (if exists)
];

const generateSitemap = () => {
  const urls: string[] = [];

  // Generate URLs for each locale and page combination
  LOCALES.forEach(locale => {
    PAGES.forEach(page => {
      const isDefaultLocale = locale === 'en';
      const localePath = isDefaultLocale ? '' : `/${locale}`;
      const fullUrl = `${DOMAIN}${localePath}${page}`;
      
      const lastmod = new Date().toISOString();
      const priority = page === '' ? '1.0' : page === '/icloud' ? '0.9' : '0.8';
      const changefreq = page === '' ? 'daily' : page === '/icloud' ? 'daily' : 'weekly';

      urls.push(`
  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`);
    });
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('')}
</urlset>`;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const sitemap = generateSitemap();
  
  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
  res.write(sitemap);
  res.end();
}
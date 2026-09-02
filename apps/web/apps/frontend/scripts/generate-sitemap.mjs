/**
 * Generate sitemap.xml with all routes (English standard + Spanish redirects)
 */
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(__dirname, '..', 'dist');

// Base URL
const BASE_URL = 'https://www.farutech.com';

// Static routes (both English and Spanish for SEO)
const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  
  // Services - English (primary)
  { path: '/services', priority: '0.9', changefreq: 'weekly' },
  { path: '/services/software-development', priority: '0.9', changefreq: 'monthly' },
  { path: '/services/saas-platforms', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/enterprise-solutions', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/ai-automation', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/ux-engineering', priority: '0.7', changefreq: 'monthly' },
  
  // Services - Spanish (redirects to English, but indexed for local SEO)
  { path: '/servicios', priority: '0.9', changefreq: 'weekly' },
  { path: '/servicios/desarrollo-software', priority: '0.9', changefreq: 'monthly' },
  { path: '/servicios/plataformas-saas', priority: '0.8', changefreq: 'monthly' },
  { path: '/servicios/soluciones-empresariales', priority: '0.8', changefreq: 'monthly' },
  { path: '/servicios/ia-automatizacion', priority: '0.8', changefreq: 'monthly' },
  { path: '/servicios/ux-engineering', priority: '0.7', changefreq: 'monthly' },
  
  // Case Studies
  { path: '/case-studies', priority: '0.8', changefreq: 'monthly' },
  { path: '/casos-exito', priority: '0.8', changefreq: 'monthly' },
  
  // About Us
  { path: '/about-us', priority: '0.7', changefreq: 'monthly' },
  { path: '/nosotros', priority: '0.7', changefreq: 'monthly' },
  
  // Ecosystem
  { path: '/ecosistema', priority: '0.6', changefreq: 'monthly' },
  
  // Legal
  { path: '/privacidad', priority: '0.3', changefreq: 'yearly' },
  { path: '/terminos', priority: '0.3', changefreq: 'yearly' },
];

function generateSitemap() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes.map(route => `  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  // Ensure dist directory exists
  try {
    mkdirSync(DIST_DIR, { recursive: true });
  } catch (e) {
    // Directory already exists
  }

  const sitemapPath = join(DIST_DIR, 'sitemap.xml');
  writeFileSync(sitemapPath, xml, 'utf-8');
  
  console.log(`✓ Sitemap generated: ${sitemapPath}`);
  console.log(`  Total URLs: ${staticRoutes.length}`);
}

generateSitemap();

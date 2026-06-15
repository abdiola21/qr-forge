/**
 * Génère public/sitemap.xml et public/robots.txt à partir de src/config/seo.json
 * Exécuté automatiquement avant chaque build (`npm run build`).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(rootDir, 'public');
const seo = JSON.parse(readFileSync(path.join(rootDir, 'src/config/seo.json'), 'utf8'));

const { siteUrl, hrefLangs, sitemapRoutes } = seo;
const lastmod = new Date().toISOString().slice(0, 10);

function pageUrl(routePath) {
  return routePath === '/' ? `${siteUrl}/` : `${siteUrl}${routePath}`;
}

function hrefLangLinks(routePath) {
  const href = pageUrl(routePath);
  return hrefLangs
    .map(
      (lang) =>
        `    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}" />`,
    )
    .join('\n');
}

function buildSitemapXml() {
  const urls = sitemapRoutes
    .map(
      (route) => `  <url>
    <loc>${pageUrl(route.path)}</loc>
${hrefLangLinks(route.path)}
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
}

function buildRobotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
}

writeFileSync(path.join(publicDir, 'sitemap.xml'), buildSitemapXml(), 'utf8');
writeFileSync(path.join(publicDir, 'robots.txt'), buildRobotsTxt(), 'utf8');

console.log(`[sitemap] ${sitemapRoutes.length} URL(s) → public/sitemap.xml (${lastmod})`);
console.log(`[sitemap] robots.txt → Sitemap: ${siteUrl}/sitemap.xml`);

/** Met à jour title, description et canonical pour le SEO (SPA) */
import { useEffect } from 'react';

interface PageSeoOptions {
  title: string;
  description?: string;
  path?: string;
  siteUrl?: string;
}

const DEFAULT_TITLE = 'QR Forge | Générateur de QR Code gratuit';
const SITE_URL = 'https://qrforge-tg.vercel.app';

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function usePageSeo({ title, description, path = '/', siteUrl = SITE_URL }: PageSeoOptions) {
  useEffect(() => {
    const fullTitle = title.includes('QR Forge') ? title : `${title} | QR Forge`;
    document.title = fullTitle;

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `${siteUrl}${path === '/' ? '/' : path}`;

    if (description) {
      setMeta('description', description);
      setMeta('og:description', description, 'property');
      setMeta('twitter:description', description);
    }

    setMeta('og:title', fullTitle, 'property');
    setMeta('twitter:title', fullTitle);
    setMeta('og:url', `${siteUrl}${path}`, 'property');

    return () => {
      document.title = DEFAULT_TITLE;
      if (canonical) canonical.href = `${siteUrl}/`;
    };
  }, [title, description, path, siteUrl]);
}

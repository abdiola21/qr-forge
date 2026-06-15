/** Met à jour title, description, canonical et balises sociales (SPA) */
import { useEffect } from 'react';
import { siteConfig } from '../config/site';
import type { Language } from '../i18n/translations';

interface PageSeoOptions {
  title: string;
  description?: string;
  path?: string;
  lang?: Language;
  noIndex?: boolean;
}

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href: string) {
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = href;
}

export function usePageSeo({
  title,
  description,
  path = '/',
  lang = 'fr',
  noIndex = false,
}: PageSeoOptions) {
  useEffect(() => {
    const defaults = siteConfig.seo[lang];
    const fullTitle = title.includes(siteConfig.name) ? title : `${title} | ${siteConfig.name}`;
    const pageUrl = `${siteConfig.siteUrl}${path === '/' ? '/' : path}`;
    const desc = description ?? defaults.homeDescription;

    document.title = fullTitle;
    document.documentElement.lang = lang;

    setCanonical(pageUrl);
    setMeta('description', desc);
    setMeta('robots', noIndex ? 'noindex, follow' : 'index, follow');
    setMeta('og:title', fullTitle, 'property');
    setMeta('og:description', desc, 'property');
    setMeta('og:url', pageUrl, 'property');
    setMeta('og:image', siteConfig.ogImage, 'property');
    setMeta('og:locale', lang === 'fr' ? 'fr_FR' : 'en_US', 'property');
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', desc);
    setMeta('twitter:image', siteConfig.ogImage);

    return () => {
      document.title = defaults.defaultTitle;
      document.documentElement.lang = 'fr';
      setCanonical(`${siteConfig.siteUrl}/`);
      setMeta('description', siteConfig.seo.fr.homeDescription);
      setMeta('robots', 'index, follow');
      setMeta('og:title', siteConfig.seo.fr.defaultTitle, 'property');
      setMeta('og:description', siteConfig.seo.fr.homeDescription, 'property');
      setMeta('og:url', `${siteConfig.siteUrl}/`, 'property');
      setMeta('og:locale', 'fr_FR', 'property');
      setMeta('twitter:title', siteConfig.seo.fr.defaultTitle);
      setMeta('twitter:description', siteConfig.seo.fr.homeDescription);
    };
  }, [title, description, path, lang, noIndex]);
}

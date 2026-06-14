/** Google Analytics 4 — suivi des pages (SPA) */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { siteConfig } from '../config/site';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_ID = siteConfig.googleAnalyticsId;

function initGtag(id: string) {
  if (window.gtag) return;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer!.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', id, { send_page_view: false });

  if (document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${id}"]`)) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);
}

export default function GoogleAnalytics() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (!GA_ID) return;
    initGtag(GA_ID);
  }, []);

  useEffect(() => {
    if (!GA_ID || !window.gtag) return;
    window.gtag('config', GA_ID, { page_path: pathname + search });
  }, [pathname, search]);

  return null;
}

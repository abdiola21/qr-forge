/** Google Analytics 4 — suivi des pages (SPA) */
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { siteConfig } from '../config/site';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_ID = siteConfig.googleAnalyticsId;

function ensureGtag(id: string): Promise<void> {
  if (!id) return Promise.resolve();

  window.dataLayer = window.dataLayer ?? [];
  if (!window.gtag) {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer!.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', id, { send_page_view: false });
  }

  const existing = document.querySelector<HTMLScriptElement>(
    `script[src*="googletagmanager.com/gtag/js?id=${id}"]`,
  );
  if (existing?.dataset.loaded === 'true') return Promise.resolve();
  if (existing) {
    return new Promise((resolve) => {
      existing.addEventListener('load', () => resolve(), { once: true });
    });
  }

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      resolve();
    }, { once: true });
    document.head.appendChild(script);
  });
}

function sendPageView(path: string) {
  if (!GA_ID || !window.gtag) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: document.title,
    send_to: GA_ID,
  });
}

export default function GoogleAnalytics() {
  const { pathname, search } = useLocation();
  const skipInitialView = useRef(true);
  const pagePath = pathname + search;

  useEffect(() => {
    if (!GA_ID) return;
    void ensureGtag(GA_ID);
  }, []);

  useEffect(() => {
    if (!GA_ID) return;

    void ensureGtag(GA_ID).then(() => {
      // La première vue est envoyée par le snippet dans index.html (build Vercel)
      if (skipInitialView.current) {
        skipInitialView.current = false;
        return;
      }
      sendPageView(pagePath);
    });
  }, [pagePath]);

  return null;
}

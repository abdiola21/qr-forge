/** Informations du site — à personnaliser avant mise en ligne */
import seo from './seo.json';

export const siteConfig = {
  /** URL publique du site (source : seo.json) */
  siteUrl: seo.siteUrl,
  name: 'QR Forge',
  /** Image Open Graph / Twitter (1200×630) */
  ogImage: `${seo.siteUrl}/og-image.png`,
  seo: {
    fr: {
      defaultTitle: 'QR Forge | Générateur de QR Code gratuit',
      homeTitle: 'Générateur de QR Code gratuit',
      homeDescription:
        'Créez des QR codes personnalisés gratuitement : logo, couleurs, PNG, SVG et PDF. Liens, contacts, réseaux sociaux, Wi-Fi et plus. Sans inscription.',
      legalDescription:
        'Mentions légales du site QR Forge, générateur de QR codes gratuit édité depuis le Togo.',
      guideDescription:
        'Guide complet et FAQ : comment créer un QR code gratuit avec logo, couleurs, WhatsApp, LinkedIn, PNG, SVG et PDF sur QR Forge.',
    },
    en: {
      defaultTitle: 'QR Forge | Free QR Code Generator',
      homeTitle: 'Free QR Code Generator',
      homeDescription:
        'Create custom QR codes for free: logo, colors, PNG, SVG and PDF. Links, contacts, social media, Wi-Fi and more. No sign-up required.',
      legalDescription:
        'Legal notice for QR Forge, a free QR code generator published from Togo.',
      guideDescription:
        'Complete guide and FAQ: how to create a free custom QR code with logo, colors, WhatsApp, LinkedIn, PNG, SVG and PDF on QR Forge.',
    },
  },
  /** ID de mesure GA4 (ex. G-XXXXXXXXXX) — variable VITE_GA_MEASUREMENT_ID sur Vercel */
  googleAnalyticsId: import.meta.env.VITE_GA_MEASUREMENT_ID ?? '',
};

export type SitemapRoute = (typeof seo.sitemapRoutes)[number];

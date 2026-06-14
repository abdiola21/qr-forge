/** Informations du site — à personnaliser avant mise en ligne */
export const siteConfig = {
  /** URL publique du site (à mettre à jour après déploiement Vercel) */
  siteUrl: 'https://qrforge-tg.vercel.app',
  name: 'QR Forge',
  /** Image Open Graph / Twitter (1200×630 recommandé ; logo SVG en attendant) */
  ogImage: 'https://qrforge-tg.vercel.app/logo.svg',
  seo: {
    fr: {
      defaultTitle: 'QR Forge | Générateur de QR Code gratuit',
      homeTitle: 'Générateur de QR Code gratuit',
      homeDescription:
        'Créez des QR codes personnalisés gratuitement : logo, couleurs, PNG, SVG et PDF. Liens, contacts, réseaux sociaux, Wi-Fi et plus. Sans inscription.',
      legalDescription:
        'Mentions légales du site QR Forge, générateur de QR codes gratuit édité depuis le Togo.',
    },
    en: {
      defaultTitle: 'QR Forge | Free QR Code Generator',
      homeTitle: 'Free QR Code Generator',
      homeDescription:
        'Create custom QR codes for free: logo, colors, PNG, SVG and PDF. Links, contacts, social media, Wi-Fi and more. No sign-up required.',
      legalDescription:
        'Legal notice for QR Forge, a free QR code generator published from Togo.',
    },
  },
  editorName: '[Votre nom ou raison sociale]',
  editorStatus: '[Statut : ex. particulier, auto-entrepreneur…]',
  editorAddress: '[Adresse à Lomé, Togo]',
  editorEmail: 'contact@example.com',
  editorPhone: '',
  hostName: 'Vercel Inc.',
  hostAddress: '440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis',
  hostWebsite: 'https://vercel.com',
};

/** Informations du site — à personnaliser avant mise en ligne */
export const siteConfig = {
  /** URL publique du site (à mettre à jour après déploiement Vercel) */
  siteUrl: 'https://qrforge-tg.vercel.app',
  /** ID de mesure GA4 (ex. G-XXXXXXXXXX) — via VITE_GA_MEASUREMENT_ID sur Vercel */
  googleAnalyticsId: import.meta.env.VITE_GA_MEASUREMENT_ID ?? '',
  editorName: '[Votre nom ou raison sociale]',
  editorStatus: '[Statut : ex. particulier, auto-entrepreneur…]',
  editorAddress: '[Adresse à Lomé, Togo]',
  editorEmail: 'contact@example.com',
  editorPhone: '',
  hostName: 'Vercel Inc.',
  hostAddress: '440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis',
  hostWebsite: 'https://vercel.com',
};

import type { SocialNetwork } from '../types/qr';

/** Générateurs d'URL à partir d'un identifiant seul */
const SOCIAL_PROFILE_URLS: Record<SocialNetwork, (username: string) => string> = {
  facebook: (u) => `https://www.facebook.com/${u}`,
  instagram: (u) => `https://www.instagram.com/${u.replace('@', '')}`,
  x: (u) => `https://x.com/${u.replace('@', '')}`,
  linkedin: (u) => `https://www.linkedin.com/in/${u.replace(/^in\//i, '')}`,
  tiktok: (u) => `https://www.tiktok.com/@${u.replace('@', '')}`,
  youtube: (u) => `https://www.youtube.com/@${u.replace('@', '')}`,
  whatsapp: (u) => `https://wa.me/${u.replace(/\D/g, '')}`,
  telegram: (u) => `https://t.me/${u.replace('@', '')}`,
  snapchat: (u) => `https://www.snapchat.com/add/${u.replace('@', '')}`,
};

/** Indique si la valeur ressemble à une URL web (avec ou sans protocole) */
function looksLikeUrl(value: string): boolean {
  return /^https?:\/\//i.test(value) || /^www\./i.test(value) || /^[a-z0-9-]+\.[a-z]{2,}(\/|$)/i.test(value);
}

/** Normalise une URL collée (ajoute https://, retire le slash final) */
function normalizeAbsoluteUrl(value: string): string {
  let url = value.trim();
  if (/^www\./i.test(url)) url = `https://${url}`;
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;

  try {
    const parsed = new URL(url);
    return parsed.toString().replace(/\/$/, '') || parsed.toString();
  } catch {
    return url;
  }
}

/**
 * Transforme une URL de profil ou un identifiant en URL https valide.
 * Gère : https://…, www.…, domaine.com/…, @user, user seul.
 */
export function normalizeSocialInput(network: SocialNetwork, raw: string): string {
  const value = raw.trim();
  if (!value) return '';

  if (looksLikeUrl(value)) {
    return normalizeAbsoluteUrl(value);
  }

  return SOCIAL_PROFILE_URLS[network](value);
}

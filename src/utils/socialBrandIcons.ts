import type { SimpleIcon } from 'simple-icons';
import {
  siFacebook,
  siInstagram,
  siX,
  siTiktok,
  siYoutube,
  siWhatsapp,
  siTelegram,
  siSnapchat,
} from 'simple-icons';
import type { SocialNetwork } from '../types/qr';

/** Données minimales d'une icône de marque */
interface BrandIconData {
  title: string;
  path: string;
  hex: string;
}

interface BrandIconStyle {
  icon: BrandIconData;
  /** Fond du badge QR (défaut : blanc) */
  badgeBg?: string;
  /** Couleur du pictogramme (défaut : couleur officielle) */
  iconColor?: string;
}

/** LinkedIn retiré de Simple Icons — tracé SVG officiel conservé localement */
const LINKEDIN_ICON: BrandIconData = {
  title: 'LinkedIn',
  hex: '0A66C2',
  path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
};

function fromSimpleIcon(icon: SimpleIcon): BrandIconData {
  return { title: icon.title, path: icon.path, hex: icon.hex };
}

/** Logos officiels — Simple Icons (CC0) + LinkedIn local */
const BRAND_ICONS: Record<SocialNetwork, BrandIconStyle> = {
  facebook: { icon: fromSimpleIcon(siFacebook) },
  instagram: { icon: fromSimpleIcon(siInstagram) },
  x: { icon: fromSimpleIcon(siX), badgeBg: '#000000', iconColor: '#FFFFFF' },
  linkedin: { icon: LINKEDIN_ICON },
  tiktok: { icon: fromSimpleIcon(siTiktok), badgeBg: '#000000', iconColor: '#FFFFFF' },
  youtube: { icon: fromSimpleIcon(siYoutube) },
  whatsapp: { icon: fromSimpleIcon(siWhatsapp) },
  telegram: { icon: fromSimpleIcon(siTelegram) },
  snapchat: { icon: fromSimpleIcon(siSnapchat), badgeBg: '#FFFC00', iconColor: '#000000' },
};

export interface SocialBrandStyle {
  path: string;
  iconColor: string;
  badgeBg: string;
  title: string;
  /** Nécessite un fond coloré (logo blanc ou badge de marque) */
  usesBadge: boolean;
}

/** Style visuel d'un réseau (couleurs + tracé SVG officiel) */
export function getSocialBrandStyle(network: SocialNetwork): SocialBrandStyle {
  const { icon, badgeBg = '#FFFFFF', iconColor = `#${icon.hex}` } = BRAND_ICONS[network];
  const usesBadge = badgeBg.toUpperCase() !== '#FFFFFF';
  return {
    path: icon.path,
    iconColor,
    badgeBg,
    title: icon.title,
    usesBadge,
  };
}

/** Badge SVG haute résolution pour le centre du QR code */
export function buildSocialLogoDataUrl(network: SocialNetwork, size = 128): string {
  const { path, iconColor, badgeBg } = getSocialBrandStyle(network);
  const pad = Math.round(size * 0.18);
  const inner = size - pad * 2;
  const scale = inner / 24;
  const offset = pad;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
      <rect width="${size}" height="${size}" rx="${Math.round(size * 0.2)}" fill="${badgeBg}"/>
      <g transform="translate(${offset} ${offset}) scale(${scale})">
        <path d="${path}" fill="${iconColor}"/>
      </g>
    </svg>
  `.trim();

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

import type { QrContent, SocialNetwork } from '../types/qr';
import { hasUnsafeUrlScheme, isSafeHttpUrl } from './urlSafety';

/** Générateurs d'URL par réseau social */
const SOCIAL_URLS: Record<SocialNetwork, (username: string) => string> = {
  facebook: (u) => `https://facebook.com/${u}`,
  instagram: (u) => `https://instagram.com/${u.replace('@', '')}`,
  x: (u) => `https://x.com/${u.replace('@', '')}`,
  linkedin: (u) => `https://linkedin.com/in/${u}`,
  tiktok: (u) => `https://tiktok.com/@${u.replace('@', '')}`,
  youtube: (u) => `https://youtube.com/@${u.replace('@', '')}`,
  whatsapp: (u) => `https://wa.me/${u.replace(/\D/g, '')}`,
  telegram: (u) => `https://t.me/${u.replace('@', '')}`,
  snapchat: (u) => `https://snapchat.com/add/${u.replace('@', '')}`,
};

/** Construit l'URL du réseau social (URL complète ou identifiant) */
function buildSocialUrl(network: SocialNetwork, value: string): string {
  if (/^https?:\/\//i.test(value)) return value;
  return SOCIAL_URLS[network](value);
}

/** Construit une fiche contact au format vCard 3.0 */
function buildVCard(contact: QrContent['contact']): string {
  const lines = ['BEGIN:VCARD', 'VERSION:3.0'];
  const fullName = [contact.firstName, contact.lastName].filter(Boolean).join(' ');
  if (fullName) lines.push(`FN:${fullName}`);
  if (contact.firstName) lines.push(`N:${contact.lastName};${contact.firstName};;;`);
  if (contact.phone) lines.push(`TEL:${contact.phone}`);
  if (contact.email) lines.push(`EMAIL:${contact.email}`);
  if (contact.company) lines.push(`ORG:${contact.company}`);
  if (contact.jobTitle) lines.push(`TITLE:${contact.jobTitle}`);
  if (contact.website) lines.push(`URL:${contact.website}`);
  if (contact.note) lines.push(`NOTE:${contact.note}`);
  lines.push('END:VCARD');
  return lines.join('\n');
}

/** Construit la chaîne WIFI:T:... pour connexion automatique */
function buildWifi(wifi: QrContent['wifi']): string {
  const enc = wifi.encryption === 'nopass' ? 'nopass' : wifi.encryption;
  return `WIFI:T:${enc};S:${wifi.ssid};P:${wifi.password};;`;
}

/** Génère la chaîne de données encodée dans le QR code */
export function buildQrPayload(content: QrContent): string {
  switch (content.type) {
    case 'url':
      return content.url.trim();
    case 'text':
      return content.text.trim();
    case 'contact':
      return buildVCard(content.contact);
    case 'video':
    case 'music':
    case 'pdf':
    case 'location':
      return content.url.trim();
    case 'social':
      return buildSocialUrl(content.socialNetwork, content.socialUsername.trim());
    case 'email': {
      const params = new URLSearchParams();
      if (content.emailSubject) params.set('subject', content.emailSubject);
      if (content.emailBody) params.set('body', content.emailBody);
      const qs = params.toString();
      return `mailto:${content.email.trim()}${qs ? `?${qs}` : ''}`;
    }
    case 'wifi':
      return buildWifi(content.wifi);
    default:
      return '';
  }
}

export type PayloadValidationIssue = 'missing' | 'unsafe_url';

function hasUnsafeUrlInContent(content: QrContent): boolean {
  switch (content.type) {
    case 'url':
    case 'video':
    case 'music':
    case 'pdf':
    case 'location':
      return hasUnsafeUrlScheme(content.url);
    case 'social': {
      const value = content.socialUsername.trim();
      return /^https?:\/\//i.test(value) && hasUnsafeUrlScheme(value);
    }
    case 'contact':
      return content.contact.website.trim() !== '' && hasUnsafeUrlScheme(content.contact.website);
    default:
      return false;
  }
}

/** Détaille pourquoi le contenu n'est pas valide (null = OK) */
export function getPayloadValidationIssue(content: QrContent): PayloadValidationIssue | null {
  if (hasUnsafeUrlInContent(content)) return 'unsafe_url';
  return isPayloadValid(content) ? null : 'missing';
}

/** Vérifie que les champs requis sont remplis pour le type choisi */
export function isPayloadValid(content: QrContent): boolean {
  if (hasUnsafeUrlInContent(content)) return false;

  const payload = buildQrPayload(content);
  if (!payload) return false;

  switch (content.type) {
    case 'url':
    case 'video':
    case 'music':
    case 'pdf':
    case 'location':
      return isSafeHttpUrl(payload);
    case 'contact':
      return !!(content.contact.phone || content.contact.email || content.contact.firstName);
    case 'social':
      return content.socialUsername.trim().length > 0;
    case 'text':
      return content.text.trim().length > 0;
    case 'email':
      return content.email.trim().includes('@');
    case 'wifi':
      return content.wifi.ssid.trim().length > 0;
    default:
      return false;
  }
}

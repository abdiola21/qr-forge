import type { QrContent, QrContentType, SocialNetwork } from '../types/qr';

/** Types qui encodent une URL http(s) */
export const URL_CONTENT_TYPES = [
  'url',
  'video',
  'music',
  'pdf',
  'images',
  'apps',
  'links',
] as const satisfies readonly QrContentType[];

export type UrlContentType = (typeof URL_CONTENT_TYPES)[number];

export function isUrlContentType(type: QrContentType): type is UrlContentType {
  return (URL_CONTENT_TYPES as readonly QrContentType[]).includes(type);
}

export function isSocialContentType(type: QrContentType): boolean {
  return type === 'social' || type === 'facebook' || type === 'whatsapp' || type === 'instagram';
}

export function isContactContentType(type: QrContentType): boolean {
  return type === 'contact';
}

/** Réseau social fixé pour les types dédiés (Facebook, WhatsApp, Instagram) */
export function resolveSocialNetwork(content: QrContent): SocialNetwork {
  if (content.type === 'facebook') return 'facebook';
  if (content.type === 'whatsapp') return 'whatsapp';
  if (content.type === 'instagram') return 'instagram';
  return content.socialNetwork;
}

/** Pré-sélection du réseau lors du changement de type */
export function socialNetworkForType(type: QrContentType): SocialNetwork | null {
  if (type === 'facebook') return 'facebook';
  if (type === 'whatsapp') return 'whatsapp';
  if (type === 'instagram') return 'instagram';
  return null;
}

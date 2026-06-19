import type { QrContent, QrDesign } from '../types/qr';
import { isSocialContentType, resolveSocialNetwork } from './contentTypeHelpers';
import { buildSocialLogoDataUrl } from './socialLogos';

/** Logo utilisateur uploadé, logo entreprise, ou logo réseau social par défaut */
export function resolveEffectiveLogo(content: QrContent, design: QrDesign): string | null {
  if (design.logoUrl) return design.logoUrl;
  if (content.type === 'business' && content.business.imageUrl) {
    return content.business.imageUrl;
  }
  if (isSocialContentType(content.type)) {
    return buildSocialLogoDataUrl(resolveSocialNetwork(content));
  }
  return null;
}

/** Indique si le logo affiché est automatique (pas un upload perso dans Design) */
export function isAutoSocialLogo(content: QrContent, design: QrDesign): boolean {
  if (content.type === 'business' && content.business.imageUrl && !design.logoUrl) {
    return true;
  }
  return isSocialContentType(content.type) && !design.logoUrl;
}

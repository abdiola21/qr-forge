import type { QrContent, QrDesign } from '../types/qr';
import { buildSocialLogoDataUrl } from './socialLogos';

/** Logo utilisateur uploadé, ou logo réseau social par défaut si type = social */
export function resolveEffectiveLogo(content: QrContent, design: QrDesign): string | null {
  if (design.logoUrl) return design.logoUrl;
  if (content.type === 'social') return buildSocialLogoDataUrl(content.socialNetwork);
  return null;
}

/** Indique si le logo affiché est celui du réseau (pas un upload perso) */
export function isAutoSocialLogo(content: QrContent, design: QrDesign): boolean {
  return content.type === 'social' && !design.logoUrl;
}

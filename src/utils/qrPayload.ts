import type { QrContent } from '../types/qr';
import {
  isContactContentType,
  isSocialContentType,
  isUrlContentType,
  resolveSocialNetwork,
} from './contentTypeHelpers';
import { buildVCardAddress } from './addressFields';
import { normalizeSocialInput } from './socialUrl';
import { hasUnsafeUrlScheme, isSafeHttpUrl } from './urlSafety';

/** Construit l'URL du réseau social (URL complète ou identifiant) */
function buildSocialUrl(network: QrContent['socialNetwork'], value: string): string {
  return normalizeSocialInput(network, value);
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
  const addr = buildVCardAddress(contact);
  if (addr) {
    lines.push(addr.adr);
    lines.push(`LABEL:${addr.label}`);
  }
  lines.push('END:VCARD');
  return lines.join('\n');
}

/** vCard entreprise avec société, activité et adresse */
function buildBusinessVCard(business: QrContent['business']): string {
  const company = business.company.trim();
  const lines = ['BEGIN:VCARD', 'VERSION:3.0'];
  lines.push(`FN:${company}`);
  lines.push(`ORG:${company}`);
  if (business.title.trim()) lines.push(`TITLE:${business.title.trim()}`);
  if (business.subtitle.trim()) lines.push(`NOTE:${business.subtitle.trim()}`);

  const addr = buildVCardAddress(business);
  if (addr) {
    lines.push(addr.adr);
    lines.push(`LABEL:${addr.label}`);
  }

  lines.push('END:VCARD');
  return lines.join('\n');
}

/** Construit la chaîne WIFI:T:... pour connexion automatique */
function buildWifi(wifi: QrContent['wifi']): string {
  const enc = wifi.encryption === 'nopass' ? 'nopass' : wifi.encryption;
  return `WIFI:T:${enc};S:${wifi.ssid};P:${wifi.password};;`;
}

/** Encode un coupon : URL du bouton avec paramètres, ou texte structuré */
function buildCoupon(coupon: QrContent['coupon']): string {
  const code = coupon.code.trim();
  const buttonUrl = coupon.buttonUrl.trim();

  if (buttonUrl) {
    try {
      const url = new URL(buttonUrl);
      url.searchParams.set('code', code);
      if (coupon.validUntil) url.searchParams.set('expires', coupon.validUntil);
      return url.toString();
    } catch {
      /* URL invalide → repli texte ci-dessous */
    }
  }

  const lines = [`COUPON: ${code}`];
  if (coupon.validUntil) lines.push(`Valid until: ${coupon.validUntil}`);
  if (coupon.terms.trim()) lines.push(`Terms: ${coupon.terms.trim()}`);
  if (coupon.buttonText.trim() && buttonUrl) {
    lines.push(`${coupon.buttonText.trim()}: ${buttonUrl}`);
  } else if (buttonUrl) {
    lines.push(buttonUrl);
  }
  return lines.join('\n');
}

/** Formate un menu digital en texte lisible pour le QR code */
function buildDigitalMenu(menu: QrContent['menu']): string {
  const lines: string[] = [];
  if (menu.restaurantName.trim()) {
    lines.push(menu.restaurantName.trim().toUpperCase(), '');
  }

  for (const section of menu.sections) {
    const titledItems = section.items.filter((item) => item.name.trim());
    if (titledItems.length === 0) continue;

    if (section.title.trim()) {
      lines.push(section.title.trim(), '—'.repeat(Math.min(section.title.trim().length, 24)));
    }

    for (const item of titledItems) {
      const price = item.price.trim() ? ` — ${item.price.trim()}` : '';
      lines.push(`• ${item.name.trim()}${price}`);
      if (item.description.trim()) lines.push(`  ${item.description.trim()}`);
    }
    lines.push('');
  }

  return lines.join('\n').trim();
}

function buildMenu(menu: QrContent['menu']): string {
  if (!menu.mode) return '';

  switch (menu.mode) {
    case 'pdf':
      return menu.pdfUrl.trim();
    case 'link':
      return menu.linkUrl.trim();
    case 'digital':
      return buildDigitalMenu(menu);
    default:
      return '';
  }
}

interface AppStoreLink {
  label: string;
  url: string;
}

function getAppStoreLinks(apps: QrContent['apps']): AppStoreLink[] {
  const links: AppStoreLink[] = [];
  if (apps.googleEnabled && apps.googleUrl.trim()) {
    links.push({ label: 'Google Play', url: apps.googleUrl.trim() });
  }
  if (apps.appleEnabled && apps.appleUrl.trim()) {
    links.push({ label: 'App Store', url: apps.appleUrl.trim() });
  }
  if (apps.amazonEnabled && apps.amazonUrl.trim()) {
    links.push({ label: 'Amazon Appstore', url: apps.amazonUrl.trim() });
  }
  return links;
}

/** Encode une app : URL principale ou fiche texte multi-stores */
function buildApps(apps: QrContent['apps']): string {
  const storeLinks = getAppStoreLinks(apps);
  const website = apps.website.trim();

  if (website && isSafeHttpUrl(website)) return website;
  if (storeLinks.length === 1) return storeLinks[0].url;

  const lines = [`APP: ${apps.appName.trim()}`];
  if (apps.developer.trim()) lines.push(`Developer: ${apps.developer.trim()}`);
  if (apps.description.trim()) lines.push(`Description: ${apps.description.trim()}`);
  if (website) lines.push(`Website: ${website}`);
  for (const link of storeLinks) lines.push(`${link.label}: ${link.url}`);
  return lines.join('\n');
}

/** Génère la chaîne de données encodée dans le QR code */
export function buildQrPayload(content: QrContent): string {
  if (isUrlContentType(content.type)) {
    return content.url.trim();
  }

  switch (content.type) {
    case 'text':
      return content.text.trim();
    case 'contact':
      return buildVCard(content.contact);
    case 'business':
      return buildBusinessVCard(content.business);
    case 'social':
    case 'facebook':
    case 'whatsapp':
    case 'instagram':
      return buildSocialUrl(resolveSocialNetwork(content), content.socialUsername.trim());
    case 'email': {
      const params = new URLSearchParams();
      if (content.emailSubject) params.set('subject', content.emailSubject);
      if (content.emailBody) params.set('body', content.emailBody);
      const qs = params.toString();
      return `mailto:${content.email.trim()}${qs ? `?${qs}` : ''}`;
    }
    case 'wifi':
      return buildWifi(content.wifi);
    case 'coupon':
      return buildCoupon(content.coupon);
    case 'menu':
      return buildMenu(content.menu);
    case 'apps':
      return buildApps(content.apps);
    case 'location':
      return content.url.trim();
    default:
      return '';
  }
}

export type PayloadValidationIssue = 'missing' | 'unsafe_url';

function hasUnsafeUrlInContent(content: QrContent): boolean {
  if (isUrlContentType(content.type)) {
    return hasUnsafeUrlScheme(content.url);
  }

  if (isSocialContentType(content.type)) {
    const url = buildSocialUrl(resolveSocialNetwork(content), content.socialUsername);
    return url !== '' && hasUnsafeUrlScheme(url);
  }

  if (isContactContentType(content.type)) {
    return content.contact.website.trim() !== '' && hasUnsafeUrlScheme(content.contact.website);
  }

  if (content.type === 'coupon' && content.coupon.buttonUrl.trim()) {
    return hasUnsafeUrlScheme(content.coupon.buttonUrl);
  }

  if (content.type === 'menu') {
    if (content.menu.mode === 'pdf' && content.menu.pdfUrl.trim()) {
      return hasUnsafeUrlScheme(content.menu.pdfUrl);
    }
    if (content.menu.mode === 'link' && content.menu.linkUrl.trim()) {
      return hasUnsafeUrlScheme(content.menu.linkUrl);
    }
  }

  if (content.type === 'location' && content.url.trim()) {
    return hasUnsafeUrlScheme(content.url);
  }

  if (content.type === 'apps') {
    const { apps } = content;
    if (apps.website.trim() && hasUnsafeUrlScheme(apps.website)) return true;
    const urls = [
      apps.googleEnabled ? apps.googleUrl : '',
      apps.appleEnabled ? apps.appleUrl : '',
      apps.amazonEnabled ? apps.amazonUrl : '',
    ].filter(Boolean);
    return urls.some((url) => hasUnsafeUrlScheme(url));
  }

  return false;
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

  if (isUrlContentType(content.type)) {
    return isSafeHttpUrl(payload);
  }

  switch (content.type) {
    case 'contact':
      return !!(content.contact.phone || content.contact.email || content.contact.firstName);
    case 'business':
      return content.business.company.trim().length > 0;
    case 'social':
    case 'facebook':
    case 'whatsapp':
    case 'instagram': {
      const url = buildSocialUrl(resolveSocialNetwork(content), content.socialUsername);
      return url !== '' && isSafeHttpUrl(url);
    }
    case 'text':
      return content.text.trim().length > 0;
    case 'email':
      return content.email.trim().includes('@');
    case 'wifi':
      return content.wifi.ssid.trim().length > 0;
    case 'coupon':
      return content.coupon.code.trim().length > 0
        && (!content.coupon.buttonUrl.trim() || isSafeHttpUrl(buildCoupon(content.coupon)));
    case 'menu': {
      const { menu } = content;
      if (!menu.mode) return false;
      if (menu.mode === 'pdf') return isSafeHttpUrl(menu.pdfUrl.trim());
      if (menu.mode === 'link') return isSafeHttpUrl(menu.linkUrl.trim());
      return buildDigitalMenu(menu).length > 0;
    }
    case 'apps': {
      const { apps } = content;
      if (!apps.appName.trim()) return false;
      const storeUrls = getAppStoreLinks(apps).map((l) => l.url);
      if (storeUrls.length === 0) return false;
      if (apps.website.trim() && !isSafeHttpUrl(apps.website.trim())) return false;
      return storeUrls.every((url) => isSafeHttpUrl(url));
    }
    case 'location':
      return isSafeHttpUrl(content.url.trim());
    default:
      return false;
  }
}

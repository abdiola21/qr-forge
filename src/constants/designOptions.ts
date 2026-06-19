import type { QrTemplate } from '../types/qr';

/** Motifs disponibles pour le corps du QR code */
export const DOT_STYLES = [
  { id: 'square' as const },
  { id: 'dots' as const },
  { id: 'rounded' as const },
  { id: 'extra-rounded' as const },
  { id: 'classy' as const },
  { id: 'classy-rounded' as const },
];

/** Formes du cadre extérieur des yeux */
export const CORNER_SQUARE_STYLES = [
  { id: 'square' as const },
  { id: 'extra-rounded' as const },
  { id: 'dot' as const },
];

/** Formes du centre des yeux */
export const CORNER_DOT_STYLES = [
  { id: 'square' as const },
  { id: 'dot' as const },
];

/** Modèles de design prédéfinis */
export const QR_TEMPLATES: QrTemplate[] = [
  {
    id: 'classic',
    name: 'classic',
    design: { foregroundColor: '#000000', backgroundColor: '#ffffff', dotStyle: 'square', cornerSquareStyle: 'square', cornerDotStyle: 'square' },
  },
  {
    id: 'neon',
    name: 'neon',
    design: { foregroundColor: '#00f5d4', backgroundColor: '#0a0e17', dotStyle: 'rounded', cornerSquareStyle: 'extra-rounded', cornerDotStyle: 'dot' },
  },
  {
    id: 'ocean',
    name: 'ocean',
    design: { foregroundColor: '#0077b6', backgroundColor: '#caf0f8', dotStyle: 'dots', cornerSquareStyle: 'extra-rounded', cornerDotStyle: 'dot' },
  },
  {
    id: 'sunset',
    name: 'sunset',
    design: { foregroundColor: '#e63946', backgroundColor: '#fff1e6', dotStyle: 'classy-rounded', cornerSquareStyle: 'dot', cornerDotStyle: 'square' },
  },
  {
    id: 'forest',
    name: 'forest',
    design: { foregroundColor: '#2d6a4f', backgroundColor: '#d8f3dc', dotStyle: 'extra-rounded', cornerSquareStyle: 'square', cornerDotStyle: 'dot' },
  },
  {
    id: 'purple',
    name: 'purple',
    design: { foregroundColor: '#7209b7', backgroundColor: '#f8f0ff', dotStyle: 'classy', cornerSquareStyle: 'extra-rounded', cornerDotStyle: 'dot' },
  },
  {
    id: 'midnight',
    name: 'midnight',
    design: { foregroundColor: '#ffffff', backgroundColor: '#1a1a2e', dotStyle: 'dots', cornerSquareStyle: 'dot', cornerDotStyle: 'dot' },
  },
  {
    id: 'gold',
    name: 'gold',
    design: { foregroundColor: '#b8860b', backgroundColor: '#fffbeb', dotStyle: 'rounded', cornerSquareStyle: 'square', cornerDotStyle: 'square' },
  },
];

/** Types de contenu affichés dans le sélecteur (ordre grille 4×4 + extras) */
export const CONTENT_TYPES = [
  { id: 'contact' as const, icon: 'User' },
  { id: 'url' as const, icon: 'Globe' },
  { id: 'pdf' as const, icon: 'FileText' },
  { id: 'images' as const, icon: 'Image' },
  { id: 'video' as const, icon: 'Video' },
  { id: 'wifi' as const, icon: 'Wifi' },
  { id: 'menu' as const, icon: 'UtensilsCrossed' },
  { id: 'business' as const, icon: 'Briefcase' },
  { id: 'music' as const, icon: 'Music' },
  { id: 'apps' as const, icon: 'Smartphone' },
  { id: 'links' as const, icon: 'Link2' },
  { id: 'coupon' as const, icon: 'TicketPercent' },
  { id: 'facebook' as const, icon: 'Share2', socialIcon: 'facebook' as const },
  { id: 'whatsapp' as const, icon: 'Share2', socialIcon: 'whatsapp' as const },
  { id: 'social' as const, icon: 'Share2' },
  { id: 'instagram' as const, icon: 'Share2', socialIcon: 'instagram' as const },
  { id: 'location' as const, icon: 'MapPin' },
  { id: 'text' as const, icon: 'Type' },
  { id: 'email' as const, icon: 'Mail' },
];

/** Liste des réseaux sociaux proposés (ordre de la grille) */
export const SOCIAL_NETWORKS = [
  { id: 'instagram' as const },
  { id: 'facebook' as const },
  { id: 'tiktok' as const },
  { id: 'youtube' as const },
  { id: 'x' as const },
  { id: 'linkedin' as const },
  { id: 'snapchat' as const },
  { id: 'whatsapp' as const },
  { id: 'telegram' as const },
];

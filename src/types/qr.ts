/** Types de contenu pris en charge par le générateur */
export type QrContentType =
  | 'url'
  | 'contact'
  | 'video'
  | 'music'
  | 'pdf'
  | 'location'
  | 'social'
  | 'text'
  | 'email'
  | 'wifi';

/** Réseaux sociaux disponibles pour les QR codes */
export type SocialNetwork =
  | 'facebook'
  | 'instagram'
  | 'x'
  | 'linkedin'
  | 'tiktok'
  | 'youtube'
  | 'whatsapp'
  | 'telegram'
  | 'snapchat';

/** Style des modules du corps du QR code */
export type DotStyle =
  | 'square'
  | 'dots'
  | 'rounded'
  | 'extra-rounded'
  | 'classy'
  | 'classy-rounded';

/** Style du cadre extérieur des yeux (coins) */
export type CornerSquareStyle = 'square' | 'extra-rounded' | 'dot';

/** Style du centre des yeux (coins) */
export type CornerDotStyle = 'square' | 'dot';

/** Données d'une fiche contact (format vCard) */
export interface ContactData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
  jobTitle: string;
  website: string;
  note: string;
}

/** Paramètres de connexion Wi-Fi encodés dans le QR code */
export interface WifiData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
}

/** Contenu saisi par l'utilisateur selon le type choisi */
export interface QrContent {
  type: QrContentType;
  url: string;
  text: string;
  contact: ContactData;
  socialNetwork: SocialNetwork;
  socialUsername: string;
  email: string;
  emailSubject: string;
  emailBody: string;
  wifi: WifiData;
}

/** Options visuelles de personnalisation du QR code */
export interface QrDesign {
  foregroundColor: string;
  backgroundColor: string;
  dotStyle: DotStyle;
  cornerSquareStyle: CornerSquareStyle;
  cornerDotStyle: CornerDotStyle;
  logoUrl: string | null;
  logoSize: number;
  margin: number;
}

/** Modèle prédéfini de design */
export interface QrTemplate {
  id: string;
  name: string;
  design: Partial<QrDesign>;
}

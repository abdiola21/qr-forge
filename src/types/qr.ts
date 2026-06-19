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
  | 'wifi'
  | 'images'
  | 'menu'
  | 'business'
  | 'apps'
  | 'coupon'
  | 'facebook'
  | 'whatsapp'
  | 'instagram';

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
  searchAddress: string;
  manualEntry: boolean;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

/** Paramètres de connexion Wi-Fi encodés dans le QR code */
export interface WifiData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
}

/** Mode de création d'un menu QR */
export type MenuMode = 'digital' | 'pdf' | 'link';

export interface MenuItem {
  name: string;
  price: string;
  description: string;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export interface MenuData {
  mode: MenuMode | null;
  restaurantName: string;
  sections: MenuSection[];
  pdfUrl: string;
  linkUrl: string;
}

/** Données d'un coupon promotionnel */
export interface CouponData {
  code: string;
  validUntil: string;
  terms: string;
  buttonText: string;
  buttonUrl: string;
}

/** Données fiche entreprise / organisation */
export interface BusinessData {
  imageUrl: string | null;
  company: string;
  title: string;
  subtitle: string;
  searchAddress: string;
  manualEntry: boolean;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

/** Boutique d'application mobile */
export type AppStore = 'google' | 'apple' | 'amazon';

/** Données QR application mobile */
export interface AppsData {
  appName: string;
  developer: string;
  description: string;
  website: string;
  googleEnabled: boolean;
  googleUrl: string;
  appleEnabled: boolean;
  appleUrl: string;
  amazonEnabled: boolean;
  amazonUrl: string;
}

/** Contenu saisi par l'utilisateur selon le type choisi */
export interface QrContent {
  type: QrContentType;
  url: string;
  locationQuery: string;
  locationManualLink: boolean;
  text: string;
  contact: ContactData;
  socialNetwork: SocialNetwork;
  socialUsername: string;
  email: string;
  emailSubject: string;
  emailBody: string;
  wifi: WifiData;
  coupon: CouponData;
  menu: MenuData;
  business: BusinessData;
  apps: AppsData;
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

/** Exemples de QR codes réels pour la section À propos */
import { useMemo } from 'react';
import type { QrDesign, SocialNetwork } from '../../types/qr';
import { useQrCode } from '../../hooks/useQrCode';
import { buildSocialLogoDataUrl } from '../../utils/socialLogos';

interface AboutSampleConfig {
  data: string;
  design: QrDesign;
  socialNetwork?: SocialNetwork;
}

const BASE: Pick<QrDesign, 'margin' | 'logoSize' | 'logoUrl'> = {
  margin: 6,
  logoSize: 28,
  logoUrl: null,
};

/** Configurations des 6 QR vitrine (URLs exemple + design + logo réseau) */
const SAMPLE_CONFIGS: Record<AboutSampleId, AboutSampleConfig> = {
  facebook: {
    data: 'https://facebook.com/qrforge',
    socialNetwork: 'facebook',
    design: {
      ...BASE,
      foregroundColor: '#1877F2',
      backgroundColor: '#ffffff',
      dotStyle: 'rounded',
      cornerSquareStyle: 'extra-rounded',
      cornerDotStyle: 'dot',
    },
  },
  youtube: {
    data: 'https://youtube.com/@qrforge',
    socialNetwork: 'youtube',
    design: {
      ...BASE,
      foregroundColor: '#FF0000',
      backgroundColor: '#ffffff',
      dotStyle: 'square',
      cornerSquareStyle: 'square',
      cornerDotStyle: 'square',
    },
  },
  instagram: {
    data: 'https://instagram.com/qrforge',
    socialNetwork: 'instagram',
    design: {
      ...BASE,
      foregroundColor: '#FF0069',
      backgroundColor: '#fff5f8',
      dotStyle: 'classy-rounded',
      cornerSquareStyle: 'extra-rounded',
      cornerDotStyle: 'dot',
    },
  },
  tiktok: {
    data: 'https://tiktok.com/@qrforge',
    socialNetwork: 'tiktok',
    design: {
      ...BASE,
      foregroundColor: '#010101',
      backgroundColor: '#ffffff',
      dotStyle: 'dots',
      cornerSquareStyle: 'dot',
      cornerDotStyle: 'dot',
    },
  },
  neon: {
    data: 'https://qr-forge.app',
    design: {
      ...BASE,
      foregroundColor: '#00f5d4',
      backgroundColor: '#0a0e17',
      dotStyle: 'rounded',
      cornerSquareStyle: 'extra-rounded',
      cornerDotStyle: 'dot',
    },
  },
  whatsapp: {
    data: 'https://wa.me/33600000000',
    socialNetwork: 'whatsapp',
    design: {
      ...BASE,
      foregroundColor: '#25D366',
      backgroundColor: '#e8f8ef',
      dotStyle: 'extra-rounded',
      cornerSquareStyle: 'square',
      cornerDotStyle: 'dot',
    },
  },
};

export const QR_SAMPLES = [
  'facebook',
  'youtube',
  'instagram',
  'tiktok',
  'neon',
  'whatsapp',
] as const;

export type AboutSampleId = (typeof QR_SAMPLES)[number];

const QR_SIZE = 160;

function AboutQrSampleInner({ id }: { id: AboutSampleId }) {
  const config = SAMPLE_CONFIGS[id];
  const logoUrl = useMemo(
    () => (config.socialNetwork ? buildSocialLogoDataUrl(config.socialNetwork) : null),
    [config.socialNetwork],
  );

  const { containerRef } = useQrCode({
    data: config.data,
    design: config.design,
    logoUrl,
    size: QR_SIZE,
  });

  return <div ref={containerRef} className="about-qr-render" aria-hidden="true" />;
}

export default function QrSample({ id }: { id: AboutSampleId }) {
  return <AboutQrSampleInner id={id} />;
}

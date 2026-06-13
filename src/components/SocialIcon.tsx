import type { SocialNetwork } from '../types/qr';
import { getSocialBrandStyle } from '../utils/socialBrandIcons';

interface SocialIconProps {
  network: SocialNetwork;
  size?: number;
}

/** Icône de marque officielle avec badge coloré si nécessaire (X, TikTok, Snapchat…) */
export default function SocialIcon({ network, size = 28 }: SocialIconProps) {
  const { path, iconColor, badgeBg, usesBadge } = getSocialBrandStyle(network);

  if (usesBadge) {
    const pad = Math.round(size * 0.16);
    const inner = size - pad * 2;
    const scale = inner / 24;
    const rx = Math.round(size * 0.22);

    return (
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        aria-hidden="true"
        role="img"
      >
        <rect width={size} height={size} rx={rx} fill={badgeBg} />
        <g transform={`translate(${pad} ${pad}) scale(${scale})`}>
          <path d={path} fill={iconColor} />
        </g>
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      role="img"
    >
      <path d={path} fill={iconColor} />
    </svg>
  );
}

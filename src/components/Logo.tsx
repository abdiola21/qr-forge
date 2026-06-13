/** Logo QR Forge — icône + wordmark */
interface LogoProps {
  /** Afficher uniquement l'icône (sans texte) */
  iconOnly?: boolean;
  /** Taille de l'icône en pixels */
  size?: number;
  className?: string;
}

export function LogoIcon({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="logo-icon"
    >
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00f5d4" />
          <stop offset="1" stopColor="#0096c7" />
        </linearGradient>
        <linearGradient id="logo-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0e1423" />
          <stop offset="1" stopColor="#06080f" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#logo-bg)" stroke="url(#logo-grad)" strokeWidth="1.5" />
      {/* Yeux QR — coin supérieur gauche */}
      <rect x="8" y="8" width="12" height="12" rx="3" stroke="url(#logo-grad)" strokeWidth="2" fill="none" />
      <rect x="11" y="11" width="6" height="6" rx="1.5" fill="url(#logo-grad)" />
      {/* Yeux QR — coin supérieur droit */}
      <rect x="28" y="8" width="12" height="12" rx="3" stroke="url(#logo-grad)" strokeWidth="2" fill="none" />
      <rect x="31" y="11" width="6" height="6" rx="1.5" fill="url(#logo-grad)" />
      {/* Yeux QR — coin inférieur gauche */}
      <rect x="8" y="28" width="12" height="12" rx="3" stroke="url(#logo-grad)" strokeWidth="2" fill="none" />
      <rect x="11" y="31" width="6" height="6" rx="1.5" fill="url(#logo-grad)" />
      {/* Motif central + symbole forge (étincelle) */}
      <circle cx="34" cy="34" r="3" fill="url(#logo-grad)" opacity="0.9" />
      <circle cx="38" cy="30" r="2" fill="url(#logo-grad)" opacity="0.6" />
      <circle cx="30" cy="38" r="2" fill="url(#logo-grad)" opacity="0.6" />
      <path
        d="M22 22 L26 18 L30 22 L26 30 Z"
        fill="url(#logo-grad)"
        opacity="0.95"
      />
    </svg>
  );
}

export default function Logo({ iconOnly = false, size = 36, className = '' }: LogoProps) {
  if (iconOnly) {
    return (
      <span className={`logo ${className}`}>
        <LogoIcon size={size} />
      </span>
    );
  }

  return (
    <span className={`logo logo-full ${className}`}>
      <LogoIcon size={size} />
      <span className="logo-wordmark">
        QR<span className="accent">Forge</span>
      </span>
    </span>
  );
}

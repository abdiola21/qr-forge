/** Fond animé — grille QR, scan, coins repère & aurora */
function FinderCorner({ className }: { className: string }) {
  return (
    <svg
      className={`bg-finder ${className}`}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="36" height="36" rx="5" stroke="currentColor" strokeWidth="2" />
      <rect x="12" y="12" width="16" height="16" rx="3" fill="currentColor" />
    </svg>
  );
}

export default function BackgroundAnimation() {
  return (
    <div className="bg-animation" aria-hidden="true">
      <div className="bg-glow-top" />
      <div className="bg-aurora" />
      <div className="bg-grid" />
      <div className="bg-scan" />

      <FinderCorner className="bg-finder-tl" />
      <FinderCorner className="bg-finder-tr" />
      <FinderCorner className="bg-finder-bl" />
      <FinderCorner className="bg-finder-br" />

      <div className="bg-pulses">
        <span className="bg-pulse-ring" />
        <span className="bg-pulse-ring" />
        <span className="bg-pulse-ring" />
      </div>

      <div className="bg-modules">
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className="bg-module" />
        ))}
      </div>

      <svg className="bg-data-links" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path className="bg-data-link bg-data-link-1" d="M12,18 L48,42 L78,32" />
        <path className="bg-data-link bg-data-link-2" d="M22,55 L48,48 L65,68" />
        <path className="bg-data-link bg-data-link-3" d="M8,48 L38,75 L85,82" />
      </svg>
    </div>
  );
}

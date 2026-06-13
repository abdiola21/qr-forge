/** Visuels illustrés pour la section guide (4 étapes) */
import type { ReactNode } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

interface GuideVisualProps {
  step: number;
}

function GuideDefs() {
  return (
    <defs>
      <linearGradient id="gv-accent" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#00f5d4" />
        <stop offset="100%" stopColor="#0096c7" />
      </linearGradient>
      <linearGradient id="gv-shine" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
      <filter id="gv-shadow" x="-15%" y="-15%" width="130%" height="130%">
        <feDropShadow dx="0" dy="3" stdDeviation="5" floodOpacity="0.2" />
      </filter>
    </defs>
  );
}

export default function GuideVisual({ step }: GuideVisualProps) {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';

  if (step === 1) return <Step1Visual isFr={isFr} />;
  if (step === 2) return <Step2Visual />;
  if (step === 3) return <Step3Visual isFr={isFr} />;
  return <Step4Visual isFr={isFr} />;
}

interface TypeChip {
  label: string;
  active?: boolean;
  icon: ReactNode;
}

function Step1Visual({ isFr }: { isFr: boolean }) {
  const chips: TypeChip[] = [
    {
      label: 'URL',
      active: true,
      icon: <path d="M6 8h-1.5a2.5 2.5 0 0 0 0 5H6M10 8h1.5a2.5 2.5 0 0 1 0 5H10M4.5 10.5h7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />,
    },
    {
      label: isFr ? 'Contact' : 'Contact',
      icon: (
        <>
          <circle cx="8" cy="6.5" r="2.2" stroke="currentColor" strokeWidth="1.4" fill="none" />
          <path d="M4 13c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        </>
      ),
    },
    {
      label: isFr ? 'Vidéo' : 'Video',
      icon: <path d="M5.5 5.5l5 3.2-5 3.2V5.5z" fill="currentColor" />,
    },
    {
      label: isFr ? 'Social' : 'Social',
      icon: (
        <>
          <rect x="4" y="4" width="8" height="8" rx="2.2" stroke="currentColor" strokeWidth="1.3" fill="none" />
          <circle cx="8" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.3" fill="none" />
        </>
      ),
    },
  ];

  return (
    <svg viewBox="0 0 280 150" className="guide-visual-svg" aria-hidden="true">
      <GuideDefs />
      <g filter="url(#gv-shadow)">
        <rect x="8" y="6" width="264" height="138" rx="14" fill="var(--bg-card-solid, #0e1423)" stroke="var(--border, #334155)" strokeWidth="1" />
        <rect x="8" y="6" width="264" height="138" rx="14" fill="url(#gv-shine)" />
        {chips.map((chip, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = 20 + col * 128;
          const y = 20 + row * 44;
          return (
            <g key={chip.label}>
              <rect
                x={x}
                y={y}
                width="116"
                height="36"
                rx="10"
                fill={chip.active ? 'rgba(0,245,212,0.12)' : 'var(--bg-surface, rgba(255,255,255,0.04))'}
                stroke={chip.active ? '#00f5d4' : 'var(--border, #334155)'}
                strokeWidth={chip.active ? 1.5 : 1}
              />
              <g transform={`translate(${x + 10} ${y + 10})`} color={chip.active ? '#00f5d4' : '#94a3b8'}>
                {chip.icon}
              </g>
              <text x={x + 32} y={y + 23} fill={chip.active ? '#00f5d4' : '#cbd5e1'} fontSize="10" fontWeight="700" fontFamily="Plus Jakarta Sans, Inter, sans-serif">{chip.label}</text>
            </g>
          );
        })}
        {/* Champ URL */}
        <rect x="20" y="108" width="240" height="24" rx="8" fill="var(--bg-muted, #1e293b)" stroke="var(--border, #334155)" strokeWidth="1" />
        <text x="32" y="124" fill="#64748b" fontSize="9" fontFamily="Inter, sans-serif">https://mon-site.com</text>
        <rect x="20" y="108" width="168" height="24" rx="8" fill="url(#gv-accent)" opacity="0.25" />
      </g>
    </svg>
  );
}

function Step2Visual() {
  const colors = ['#00f5d4', '#7209b7', '#e63946', '#fbbf24'];
  const origin = { x: 98, y: 14 };
  const cell = 9;

  const modules: [number, number][] = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if ((r < 2 && c < 2) || (r < 2 && c > 5) || (r > 5 && c < 2)) continue;
      if (r >= 2 && r <= 4 && c >= 2 && c <= 4) continue;
      if ((r + c) % 4 === 0) continue;
      modules.push([c, r]);
    }
  }

  return (
    <svg viewBox="0 0 280 150" className="guide-visual-svg" aria-hidden="true">
      <GuideDefs />
      <g filter="url(#gv-shadow)">
        <rect x="88" y="4" width="104" height="104" rx="14" fill="#0a0e17" />
        {[[0, 0], [6, 0], [0, 6]].map(([c, r]) => (
          <g key={`${c}-${r}`}>
            <rect x={origin.x + c * cell} y={origin.y + r * cell} width={cell * 2.2} height={cell * 2.2} rx="3" fill="none" stroke="#7209b7" strokeWidth="2" />
            <rect x={origin.x + c * cell + 2.5} y={origin.y + r * cell + 2.5} width={cell * 1.2} height={cell * 1.2} rx="1.5" fill="#7209b7" />
          </g>
        ))}
        {modules.map(([c, r]) => (
          <rect
            key={`${c}-${r}`}
            x={origin.x + c * cell + 0.5}
            y={origin.y + r * cell + 0.5}
            width={cell - 1}
            height={cell - 1}
            rx="2.5"
            fill={colors[(c + r) % colors.length]}
          />
        ))}
        <rect x="128" y="44" width="24" height="24" rx="7" fill="#fff" />
        <circle cx="140" cy="56" r="6" fill="none" stroke="#FF0069" strokeWidth="1.8" />
        <circle cx="140" cy="56" r="2" fill="#FF0069" />
      </g>
      {colors.map((c, i) => (
        <g key={c}>
          <circle cx={72 + i * 48} cy="132" r="11" fill={c} stroke="#fff" strokeWidth="2" />
          {i === 1 && <circle cx={72 + i * 48} cy="132" r="14.5" fill="none" stroke={c} strokeWidth="2" opacity="0.8" />}
        </g>
      ))}
    </svg>
  );
}

function Step3Visual({ isFr }: { isFr: boolean }) {
  const scanLabel = isFr ? 'Scan OK' : 'Scan OK';

  return (
    <svg viewBox="0 0 280 150" className="guide-visual-svg" aria-hidden="true">
      <GuideDefs />
      <g filter="url(#gv-shadow)">
        <rect x="16" y="8" width="248" height="134" rx="14" fill="var(--bg-card-solid, #0e1423)" stroke="var(--border, #334155)" strokeWidth="1" />
        {/* QR preview */}
        <rect x="36" y="28" width="88" height="88" rx="10" fill="#fff" />
        {[0, 1, 2, 3, 4, 5].map((r) =>
          [0, 1, 2, 3, 4, 5].map((c) => {
            if ((r < 2 && c < 2) || (r < 2 && c > 3) || (r > 3 && c < 2)) return null;
            if (r === 2 && c === 2) return null;
            return (
              <rect
                key={`${r}-${c}`}
                x={44 + c * 12}
                y={36 + r * 12}
                width={9}
                height={9}
                rx="2.5"
                fill="url(#gv-accent)"
                opacity={0.45 + ((r + c) % 3) * 0.18}
              />
            );
          })
        )}
        <rect x="44" y="33" width="22" height="22" rx="4" fill="none" stroke="#0a0e17" strokeWidth="2" />
        <rect x="94" y="33" width="22" height="22" rx="4" fill="none" stroke="#0a0e17" strokeWidth="2" />
        <rect x="44" y="83" width="22" height="22" rx="4" fill="none" stroke="#0a0e17" strokeWidth="2" />

        {/* Curseur résolution */}
        <text x="148" y="42" fill="var(--text-muted, #64748b)" fontSize="8" fontWeight="600" fontFamily="Inter, sans-serif">{isFr ? 'RÉSOLUTION' : 'RESOLUTION'}</text>
        <rect x="140" y="50" width="112" height="7" rx="4" fill="var(--border, #334155)" />
        <rect x="140" y="50" width="72" height="7" rx="4" fill="url(#gv-accent)" />
        <circle cx="212" cy="53.5" r="10" fill="#00f5d4" stroke="#0a0e17" strokeWidth="2" />
        <text x="148" y="78" fill="#94a3b8" fontSize="9" fontFamily="Inter, sans-serif">280 px</text>

        {/* Validation scan */}
        <rect x="140" y="88" width="112" height="28" rx="9" fill="rgba(34,197,94,0.12)" stroke="#22c55e" strokeWidth="1" />
        <circle cx="154" cy="102" r="5" fill="#22c55e">
          <animate attributeName="opacity" values="1;0.35;1" dur="2.2s" repeatCount="indefinite" />
        </circle>
        <path d="M151 102l2 2 5-5" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <text x="166" y="105" fill="#4ade80" fontSize="9" fontWeight="700" fontFamily="Plus Jakarta Sans, Inter, sans-serif">{scanLabel}</text>
      </g>
    </svg>
  );
}

function Step4Visual({ isFr }: { isFr: boolean }) {
  const dl = isFr ? 'Télécharger' : 'Download';
  const formats = [
    { label: 'PNG', color: '#0077b6', grad: ['#0096c7', '#0077b6'], x: 14 },
    { label: 'SVG', color: '#7c3aed', grad: ['#9333ea', '#7c3aed'], x: 100 },
    { label: 'PDF', color: '#15803d', grad: ['#22c55e', '#15803d'], x: 186 },
  ];

  return (
    <svg viewBox="0 0 280 150" className="guide-visual-svg" aria-hidden="true">
      <GuideDefs />
      {/* QR fantôme en arrière-plan */}
      <rect x="98" y="8" width="84" height="84" rx="10" fill="#fff" opacity="0.06" />
      {formats.map((f) => (
        <g key={f.label} filter="url(#gv-shadow)">
          <defs>
            <linearGradient id={`gv-fmt-${f.label}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={f.grad[0]} />
              <stop offset="100%" stopColor={f.grad[1]} />
            </linearGradient>
          </defs>
          <rect x={f.x} y="52" width="80" height="88" rx="14" fill={`url(#gv-fmt-${f.label})`} />
          <rect x={f.x} y="52" width="80" height="88" rx="14" fill="url(#gv-shine)" />
          <text x={f.x + 40} y={88} textAnchor="middle" fill="#fff" fontSize="15" fontWeight="800" fontFamily="Plus Jakarta Sans, Inter, sans-serif">{f.label}</text>
          <g transform={`translate(${f.x + 32} 98)`} color="rgba(255,255,255,0.9)">
            <path d="M8 2v8M8 10l-3-3M8 10l3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M3 14h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </g>
          <text x={f.x + 40} y="128" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="7.5" fontFamily="Inter, sans-serif">{dl}</text>
        </g>
      ))}
    </svg>
  );
}

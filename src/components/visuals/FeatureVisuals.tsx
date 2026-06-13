/** Visuels illustrés pour la section fonctionnalités */
import type { ReactNode } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

type FeatureId = 'multiContent' | 'customDesign' | 'export' | 'instant';

interface FeatureVisualProps {
  id: FeatureId;
}

/** Dégradés partagés entre les visuels */
function VisualDefs() {
  return (
    <defs>
      <linearGradient id="fv-accent" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#00f5d4" />
        <stop offset="100%" stopColor="#0096c7" />
      </linearGradient>
      <linearGradient id="fv-card-shine" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
      <filter id="fv-soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.18" />
      </filter>
    </defs>
  );
}

export default function FeatureVisual({ id }: FeatureVisualProps) {
  const { lang } = useLanguage();

  if (id === 'multiContent') return <MultiContentVisual lang={lang} />;
  if (id === 'customDesign') return <DesignVisual />;
  if (id === 'export') return <ExportVisual lang={lang} />;
  return <InstantVisual lang={lang} />;
}

interface ContentTile {
  label: string;
  sub: string;
  bg: string;
  accent: string;
  icon: ReactNode;
  x: number;
  y: number;
}

function MultiContentVisual({ lang }: { lang: string }) {
  const isFr = lang === 'fr';

  const tiles: ContentTile[] = [
    {
      label: 'URL',
      sub: 'https://…',
      bg: '#0f2744',
      accent: '#60a5fa',
      x: 8,
      y: 12,
      icon: (
        <path d="M14 10h-2.5a4.5 4.5 0 0 0 0 9H14M18 10h2.5a4.5 4.5 0 0 1 0 9H18M11 14h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      ),
    },
    {
      label: isFr ? 'Contact' : 'Contact',
      sub: 'vCard',
      bg: '#0d3320',
      accent: '#4ade80',
      x: 112,
      y: 12,
      icon: (
        <>
          <circle cx="16" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" fill="none" />
          <path d="M8 26c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </>
      ),
    },
    {
      label: isFr ? 'Réseaux' : 'Social',
      sub: 'Instagram…',
      bg: '#3b1030',
      accent: '#f472b6',
      x: 216,
      y: 12,
      icon: (
        <>
          <rect x="8" y="8" width="16" height="16" rx="4.5" stroke="currentColor" strokeWidth="1.8" fill="none" />
          <circle cx="16" cy="16" r="3.8" stroke="currentColor" strokeWidth="1.8" fill="none" />
          <circle cx="21" cy="11" r="1.1" fill="currentColor" />
        </>
      ),
    },
    {
      label: isFr ? 'Vidéo' : 'Video',
      sub: 'YouTube',
      bg: '#3b1515',
      accent: '#f87171',
      x: 8,
      y: 88,
      icon: <path d="M11 10l9 5.5L11 21V10z" fill="currentColor" />,
    },
    {
      label: 'Wi-Fi',
      sub: isFr ? 'Connexion' : 'Connect',
      bg: '#1e1b4b',
      accent: '#a78bfa',
      x: 112,
      y: 88,
      icon: (
        <>
          <path d="M16 22v-2M12.5 18.5a5 5 0 0 1 7 0M9.5 15.5a9 9 0 0 1 13 0M6.5 12.5a13 13 0 0 1 19 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </>
      ),
    },
    {
      label: 'PDF',
      sub: isFr ? 'Fichier' : 'File',
      bg: '#0c3540',
      accent: '#22d3ee',
      x: 216,
      y: 88,
      icon: (
        <>
          <path d="M12 6h8l4 4v14a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.8" fill="none" />
          <path d="M20 6v4h4" stroke="currentColor" strokeWidth="1.8" fill="none" />
        </>
      ),
    },
  ];

  return (
    <svg viewBox="0 0 320 168" className="feature-visual-svg" aria-hidden="true">
      <VisualDefs />
      {tiles.map((t) => (
        <g key={t.label} filter="url(#fv-soft-shadow)">
          <rect x={t.x} y={t.y} width="96" height="68" rx="14" fill={t.bg} />
          <rect x={t.x} y={t.y} width="96" height="68" rx="14" fill="url(#fv-card-shine)" />
          <rect x={t.x + 10} y={t.y + 10} width="32" height="32" rx="9" fill={t.accent} fillOpacity="0.15" />
          <g transform={`translate(${t.x + 18} ${t.y + 18})`} color={t.accent}>
            {t.icon}
          </g>
          <text x={t.x + 48} y={t.y + 28} fill="#f1f5f9" fontSize="11" fontWeight="700" fontFamily="Plus Jakarta Sans, Inter, sans-serif">{t.label}</text>
          <text x={t.x + 48} y={t.y + 44} fill="#94a3b8" fontSize="9" fontFamily="Inter, sans-serif">{t.sub}</text>
        </g>
      ))}
      {/* Lignes de connexion discrètes */}
      <circle cx="160" cy="164" r="3" fill="url(#fv-accent)" opacity="0.6" />
    </svg>
  );
}

function DesignVisual() {
  const colors = ['#00f5d4', '#7209b7', '#e63946', '#fbbf24', '#0077b6'];
  const qrOrigin = { x: 108, y: 8 };
  const cell = 11;

  const modules: [number, number][] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const inTL = r < 3 && c < 3;
      const inTR = r < 3 && c > 5;
      const inBL = r > 5 && c < 3;
      const center = r >= 3 && r <= 5 && c >= 3 && c <= 5;
      if (inTL || inTR || inBL || center) continue;
      if ((r + c) % 5 === 0) continue;
      modules.push([c, r]);
    }
  }

  return (
    <svg viewBox="0 0 320 168" className="feature-visual-svg" aria-hidden="true">
      <VisualDefs />
      <g filter="url(#fv-soft-shadow)">
        <rect x="98" y="0" width="124" height="124" rx="16" fill="#0a0e17" />
        {/* Yeux QR */}
        {[[0, 0], [6, 0], [0, 6]].map(([c, r]) => (
          <g key={`${c}-${r}`}>
            <rect x={qrOrigin.x + c * cell} y={qrOrigin.y + r * cell} width={cell * 3} height={cell * 3} rx="4" fill="none" stroke="#00f5d4" strokeWidth="2.5" />
            <rect x={qrOrigin.x + c * cell + cell * 0.85} y={qrOrigin.y + r * cell + cell * 0.85} width={cell * 1.3} height={cell * 1.3} rx="2" fill="#00f5d4" />
          </g>
        ))}
        {/* Modules colorés */}
        {modules.map(([c, r]) => (
          <rect
            key={`m-${c}-${r}`}
            x={qrOrigin.x + c * cell + 1}
            y={qrOrigin.y + r * cell + 1}
            width={cell - 2}
            height={cell - 2}
            rx="3"
            fill={colors[(c + r) % colors.length]}
            opacity="0.9"
          />
        ))}
        {/* Logo central */}
        <rect x="143" y="43" width="34" height="34" rx="10" fill="#fff" />
        <rect x="147" y="47" width="26" height="26" rx="7" fill="#FF0069" fillOpacity="0.12" />
        <circle cx="160" cy="60" r="7" fill="none" stroke="#FF0069" strokeWidth="2" />
        <circle cx="160" cy="60" r="2.5" fill="#FF0069" />
      </g>
      {/* Palette + curseurs */}
      <text x="160" y="142" textAnchor="middle" fill="var(--text-muted, #64748b)" fontSize="8" fontWeight="600" letterSpacing="0.08em" fontFamily="Inter, sans-serif">COULEURS · FORMES · LOGO</text>
      {colors.map((color, i) => (
        <g key={color}>
          <circle cx={88 + i * 36} cy="156" r="13" fill={color} stroke="#fff" strokeWidth="2.5" />
          {i === 0 && <circle cx={88 + i * 36} cy="156" r="17" fill="none" stroke={color} strokeWidth="2" opacity="0.7" />}
        </g>
      ))}
    </svg>
  );
}

function ExportVisual({ lang }: { lang: string }) {
  const isFr = lang === 'fr';
  const formats = [
    { label: 'PNG', sub: isFr ? 'Web & réseaux' : 'Web & social', color: '#0077b6', grad: ['#0096c7', '#0077b6'] },
    { label: 'SVG', sub: isFr ? 'Vectoriel pro' : 'Vector pro', color: '#7c3aed', grad: ['#9333ea', '#7c3aed'] },
    { label: 'PDF', sub: isFr ? 'Impression' : 'Print', color: '#15803d', grad: ['#22c55e', '#15803d'] },
  ];

  return (
    <svg viewBox="0 0 320 168" className="feature-visual-svg" aria-hidden="true">
      <VisualDefs />
      {formats.map((f, i) => {
        const y = 10 + i * 52;
        return (
          <g key={f.label} filter="url(#fv-soft-shadow)">
            <defs>
              <linearGradient id={`fv-fmt-${i}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={f.grad[0]} />
                <stop offset="100%" stopColor={f.grad[1]} />
              </linearGradient>
            </defs>
            <rect x="16" y={y} width="288" height="44" rx="14" fill={`url(#fv-fmt-${i})`} />
            <rect x="16" y={y} width="288" height="44" rx="14" fill="url(#fv-card-shine)" />
            {/* Icône téléchargement */}
            <g transform={`translate(36 ${y + 14})`} color="#fff">
              <path d="M8 3v10M8 13l-3.5-3.5M8 13l3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M3 17h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
            </g>
            <text x="58" y={y + 22} fill="#fff" fontSize="13" fontWeight="800" fontFamily="Plus Jakarta Sans, Inter, sans-serif">{f.label}</text>
            <text x="58" y={y + 36} fill="rgba(255,255,255,0.75)" fontSize="9" fontFamily="Inter, sans-serif">{f.sub}</text>
            {/* Mini QR */}
            <rect x="262" y={y + 8} width="28" height="28" rx="6" fill="#fff" fillOpacity="0.95" />
            <MiniQr x={266} y={y + 12} color={f.color} />
          </g>
        );
      })}
    </svg>
  );
}

function MiniQr({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <>
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2, 3].map((c) => (
          <rect
            key={`${r}-${c}`}
            x={x + c * 5}
            y={y + r * 5}
            width={3.5}
            height={3.5}
            rx={0.8}
            fill={color}
            opacity={0.35 + ((r + c) % 3) * 0.22}
          />
        ))
      )}
    </>
  );
}

function InstantVisual({ lang }: { lang: string }) {
  const label = lang === 'fr' ? 'Aperçu en direct' : 'Live preview';

  return (
    <svg viewBox="0 0 320 168" className="feature-visual-svg" aria-hidden="true">
      <VisualDefs />
      <g filter="url(#fv-soft-shadow)">
        {/* Fenêtre app */}
        <rect x="24" y="4" width="272" height="160" rx="16" fill="var(--bg-card-solid, #0e1423)" stroke="var(--border, #334155)" strokeWidth="1.5" />
        <rect x="24" y="4" width="272" height="32" rx="16" fill="var(--bg-muted, #1e293b)" />
        <rect x="24" y="20" width="272" height="16" fill="var(--bg-muted, #1e293b)" />
        <circle cx="44" cy="20" r="5" fill="#ef4444" />
        <circle cx="60" cy="20" r="5" fill="#fbbf24" />
        <circle cx="76" cy="20" r="5" fill="#22c55e" />
        <text x="160" y="24" textAnchor="middle" fill="var(--text-muted, #64748b)" fontSize="9" fontWeight="600" fontFamily="Inter, sans-serif">QR Forge Preview</text>

        {/* Panneau QR */}
        <rect x="44" y="44" width="232" height="108" rx="12" fill="var(--bg-surface, rgba(255,255,255,0.04))" stroke="var(--border, #334155)" strokeWidth="1" />
        <rect x="72" y="56" width="80" height="80" rx="10" fill="#0a0e17" />
        {/* QR stylisé */}
        {[0, 1, 2, 3, 4, 5].map((r) =>
          [0, 1, 2, 3, 4, 5].map((c) => {
            if ((r < 2 && c < 2) || (r < 2 && c > 3) || (r > 3 && c < 2)) return null;
            if (r === 2 && c === 2) return null;
            return (
              <rect
                key={`${r}-${c}`}
                x={78 + c * 11}
                y={62 + r * 11}
                width={8}
                height={8}
                rx="2.5"
                fill="url(#fv-accent)"
                opacity={0.55 + ((r + c) % 3) * 0.15}
              />
            );
          })
        )}
        <rect x="78" y="59" width="24" height="24" rx="5" fill="none" stroke="#00f5d4" strokeWidth="2" />
        <rect x="126" y="59" width="24" height="24" rx="5" fill="none" stroke="#00f5d4" strokeWidth="2" />
        <rect x="78" y="107" width="24" height="24" rx="5" fill="none" stroke="#00f5d4" strokeWidth="2" />

        {/* Contrôles droite */}
        <rect x="168" y="62" width="96" height="8" rx="4" fill="var(--border, #334155)" />
        <rect x="168" y="62" width="62" height="8" rx="4" fill="url(#fv-accent)" />
        <circle cx="230" cy="66" r="9" fill="#00f5d4" stroke="#0a0e17" strokeWidth="2" />
        <text x="216" y="84" fill="var(--text-secondary, #94a3b8)" fontSize="8" fontFamily="Inter, sans-serif">280px</text>

        <rect x="168" y="96" width="96" height="28" rx="8" fill="var(--accent-subtle, rgba(0,245,212,0.1))" stroke="var(--border-active, #00f5d4)" strokeWidth="1" />
        <circle cx="180" cy="110" r="4" fill="#22c55e">
          <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
        </circle>
        <text x="192" y="113" fill="var(--accent, #00f5d4)" fontSize="9" fontWeight="700" fontFamily="Plus Jakarta Sans, Inter, sans-serif">{label}</text>
      </g>
    </svg>
  );
}

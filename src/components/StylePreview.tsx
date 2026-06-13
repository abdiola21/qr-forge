/** Aperçu SVG des styles de motif pour le panneau de design */
interface StylePreviewProps {
  type: 'dot' | 'cornerSquare' | 'cornerDot';
  style: string;
}

export default function StylePreview({ type, style }: StylePreviewProps) {
  const renderDots = () => {
    // Motifs disponibles pour le corps du QR code
    const patterns: Record<string, React.ReactNode> = {
      square: (
        <svg viewBox="0 0 40 40" className="preview-svg">
          {[0, 1, 2, 3].map((r) =>
            [0, 1, 2, 3].map((c) => (
              <rect key={`${r}-${c}`} x={c * 10 + 1} y={r * 10 + 1} width={8} height={8} fill="#111" />
            ))
          )}
        </svg>
      ),
      dots: (
        <svg viewBox="0 0 40 40" className="preview-svg">
          {[0, 1, 2, 3].map((r) =>
            [0, 1, 2, 3].map((c) => (
              <circle key={`${r}-${c}`} cx={c * 10 + 5} cy={r * 10 + 5} r={3.5} fill="#111" />
            ))
          )}
        </svg>
      ),
      rounded: (
        <svg viewBox="0 0 40 40" className="preview-svg">
          {[0, 1, 2, 3].map((r) =>
            [0, 1, 2, 3].map((c) => (
              <rect key={`${r}-${c}`} x={c * 10 + 1} y={r * 10 + 1} width={8} height={8} rx={2} fill="#111" />
            ))
          )}
        </svg>
      ),
      'extra-rounded': (
        <svg viewBox="0 0 40 40" className="preview-svg">
          {[0, 1, 2, 3].map((r) =>
            [0, 1, 2, 3].map((c) => (
              <rect key={`${r}-${c}`} x={c * 10 + 1} y={r * 10 + 1} width={8} height={8} rx={4} fill="#111" />
            ))
          )}
        </svg>
      ),
      classy: (
        <svg viewBox="0 0 40 40" className="preview-svg">
          {[0, 1, 2, 3].map((r) =>
            [0, 1, 2, 3].map((c) => (
              <path
                key={`${r}-${c}`}
                d={`M${c * 10 + 1},${r * 10 + 5} Q${c * 10 + 1},${r * 10 + 1} ${c * 10 + 5},${r * 10 + 1} L${c * 10 + 9},${r * 10 + 1} L${c * 10 + 9},${r * 10 + 9} L${c * 10 + 5},${r * 10 + 9} Q${c * 10 + 1},${r * 10 + 9} ${c * 10 + 1},${r * 10 + 5}`}
                fill="#111"
              />
            ))
          )}
        </svg>
      ),
      'classy-rounded': (
        <svg viewBox="0 0 40 40" className="preview-svg">
          {[0, 1, 2, 3].map((r) =>
            [0, 1, 2, 3].map((c) => (
              <circle key={`${r}-${c}`} cx={c * 10 + 5} cy={r * 10 + 5} r={3.5} fill="#111" />
            ))
          )}
        </svg>
      ),
    };
    return patterns[style] || patterns.square;
  };

  const renderCornerSquare = () => {
    // Formes du cadre extérieur des yeux
    const shapes: Record<string, React.ReactNode> = {
      square: (
        <svg viewBox="0 0 40 40" className="preview-svg">
          <rect x={4} y={4} width={32} height={32} fill="none" stroke="#111" strokeWidth={4} />
        </svg>
      ),
      'extra-rounded': (
        <svg viewBox="0 0 40 40" className="preview-svg">
          <rect x={4} y={4} width={32} height={32} rx={8} fill="none" stroke="#111" strokeWidth={4} />
        </svg>
      ),
      dot: (
        <svg viewBox="0 0 40 40" className="preview-svg">
          <circle cx={20} cy={20} r={14} fill="none" stroke="#111" strokeWidth={4} />
        </svg>
      ),
    };
    return shapes[style] || shapes.square;
  };

  const renderCornerDot = () => {
    // Formes du centre des yeux
    const shapes: Record<string, React.ReactNode> = {
      square: (
        <svg viewBox="0 0 40 40" className="preview-svg">
          <rect x={10} y={10} width={20} height={20} fill="#111" />
        </svg>
      ),
      dot: (
        <svg viewBox="0 0 40 40" className="preview-svg">
          <circle cx={20} cy={20} r={10} fill="#111" />
        </svg>
      ),
    };
    return shapes[style] || shapes.square;
  };

  if (type === 'dot') return renderDots();
  if (type === 'cornerSquare') return renderCornerSquare();
  return renderCornerDot();
}

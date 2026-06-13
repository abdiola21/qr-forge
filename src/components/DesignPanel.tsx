/** Panneau de personnalisation visuelle du QR code */
import type { QrDesign } from '../types/qr';
import { DOT_STYLES, CORNER_SQUARE_STYLES, CORNER_DOT_STYLES, QR_TEMPLATES } from '../constants/designOptions';
import { useLanguage } from '../i18n/LanguageContext';
import StylePreview from './StylePreview';

interface DesignPanelProps {
  design: QrDesign;
  onChange: (design: QrDesign) => void;
}

export default function DesignPanel({ design, onChange }: DesignPanelProps) {
  const { t } = useLanguage();
  const d = t.design;

  const update = <K extends keyof QrDesign>(key: K, value: QrDesign[K]) => {
    onChange({ ...design, [key]: value });
  };

  const applyTemplate = (templateId: string) => {
    const template = QR_TEMPLATES.find((tpl) => tpl.id === templateId);
    if (template) {
      onChange({ ...design, ...template.design });
    }
  };

  return (
    <div className="design-panel">
      <div className="design-section">
        <h3>{d.templates}</h3>
        <div className="template-grid">
          {QR_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              className="template-btn"
              onClick={() => applyTemplate(tpl.id)}
              title={t.templates[tpl.name as keyof typeof t.templates]}
            >
              <span
                className="template-swatch"
                style={{
                  background: tpl.design.backgroundColor,
                  border: `3px solid ${tpl.design.foregroundColor}`,
                }}
              />
              <span className="template-name">{t.templates[tpl.name as keyof typeof t.templates]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="design-section">
        <h3>{d.colors}</h3>
        <div className="color-row">
          <div className="color-field">
            <label htmlFor="fg-color">{d.foreground}</label>
            <div className="color-input-wrap">
              <input
                id="fg-color"
                type="color"
                value={design.foregroundColor}
                onChange={(e) => update('foregroundColor', e.target.value)}
              />
              <span>{design.foregroundColor}</span>
            </div>
          </div>
          <div className="color-field">
            <label htmlFor="bg-color">{d.background}</label>
            <div className="color-input-wrap">
              <input
                id="bg-color"
                type="color"
                value={design.backgroundColor}
                onChange={(e) => update('backgroundColor', e.target.value)}
              />
              <span>{design.backgroundColor}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="design-section">
        <h3>{d.bodyPattern}</h3>
        <div className="style-grid">
          {DOT_STYLES.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`style-btn ${design.dotStyle === s.id ? 'active' : ''}`}
              onClick={() => update('dotStyle', s.id)}
              title={t.dotStyles[s.id]}
            >
              <StylePreview type="dot" style={s.id} />
            </button>
          ))}
        </div>
      </div>

      <div className="design-section">
        <h3>{d.eyeFrame}</h3>
        <div className="style-grid style-grid-sm">
          {CORNER_SQUARE_STYLES.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`style-btn ${design.cornerSquareStyle === s.id ? 'active' : ''}`}
              onClick={() => update('cornerSquareStyle', s.id)}
              title={t.cornerSquareStyles[s.id]}
            >
              <StylePreview type="cornerSquare" style={s.id} />
            </button>
          ))}
        </div>
      </div>

      <div className="design-section">
        <h3>{d.eyeCenter}</h3>
        <div className="style-grid style-grid-sm">
          {CORNER_DOT_STYLES.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`style-btn ${design.cornerDotStyle === s.id ? 'active' : ''}`}
              onClick={() => update('cornerDotStyle', s.id)}
              title={t.cornerDotStyles[s.id]}
            >
              <StylePreview type="cornerDot" style={s.id} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Section À propos — présentation du générateur QR Forge */
import { Gift, Image, Palette, Maximize2, Download } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import QrSample, { QR_SAMPLES } from './visuals/AboutQrSamples';

const FEATURE_ICONS = [Gift, Image, Palette, Maximize2, Download] as const;

export default function AboutSection() {
  const { t } = useLanguage();
  const a = t.about;

  const features = [
    { title: a.feature1Title, desc: a.feature1Desc },
    { title: a.feature2Title, desc: a.feature2Desc },
    { title: a.feature3Title, desc: a.feature3Desc },
    { title: a.feature4Title, desc: a.feature4Desc },
    { title: a.feature5Title, desc: a.feature5Desc },
  ];

  return (
    <section id="about" className="about-section">
      <div className="section-inner">
        <span className="section-label">{a.label}</span>
        <h2 className="section-title section-title-wide">{a.title}</h2>
        <p className="about-intro">{a.intro}</p>

        <div className="about-showcase">
          <p className="about-showcase-label">{a.samplesLabel}</p>
          <div className="about-qr-row">
            {QR_SAMPLES.map((id, i) => (
              <div
                key={id}
                className="about-qr-item"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="about-qr-card">
                  <QrSample id={id} />
                </div>
                <span className="about-qr-label">{a.qrLabels[id]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="about-features-grid">
          {features.map((f, i) => {
            const Icon = FEATURE_ICONS[i];
            return (
              <article key={f.title} className="about-feature-card">
                <div className="about-feature-icon">
                  <Icon size={22} strokeWidth={2} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

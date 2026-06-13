/** Section « En savoir plus » — présentation des fonctionnalités avec visuels */
import { useLanguage } from '../i18n/LanguageContext';
import FeatureVisual from './visuals/FeatureVisuals';

export default function FeaturesSection() {
  const { t } = useLanguage();

  const features = [
    { id: 'multiContent' as const, title: t.features.multiContent, description: t.features.multiContentDesc },
    { id: 'customDesign' as const, title: t.features.customDesign, description: t.features.customDesignDesc },
    { id: 'export' as const, title: t.features.export, description: t.features.exportDesc },
    { id: 'instant' as const, title: t.features.instant, description: t.features.instantDesc },
  ];

  return (
    <section id="features" className="features-section">
      <div className="section-inner">
        <span className="section-label">{t.features.label}</span>
        <h2 className="section-title section-title-wide">{t.features.plansTitle}</h2>
        <div className="features-grid features-grid-visual">
          {features.map((f) => (
            <article key={f.id} className="feature-card-visual">
              <div className="feature-card-text">
                <h3>{f.title}</h3>
                <p>{f.description}</p>
              </div>
              <div className="feature-card-visual-wrap">
                <FeatureVisual id={f.id} />
              </div>
            </article>
          ))}
        </div>
        <a href="#generator" className="cta-btn">{t.features.cta}</a>
      </div>
    </section>
  );
}

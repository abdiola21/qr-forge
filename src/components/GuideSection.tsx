/** Section guide — étapes pour créer un QR code en 4 temps */
import { useLanguage } from '../i18n/LanguageContext';
import GuideVisual from './visuals/GuideVisuals';

export default function GuideSection() {
  const { t } = useLanguage();

  const steps = [
    { number: 1, title: t.guide.step1Title, description: t.guide.step1Desc },
    { number: 2, title: t.guide.step2Title, description: t.guide.step2Desc },
    { number: 3, title: t.guide.step3Title, description: t.guide.step3Desc },
    { number: 4, title: t.guide.step4Title, description: t.guide.step4Desc },
  ];

  return (
    <section id="guide" className="guide-section">
      <div className="section-inner">
        <span className="section-label">{t.guide.label}</span>
        <h2 className="section-title dark section-title-wide">{t.guide.title}</h2>
        <div className="steps-grid steps-grid-visual">
          {steps.map((step) => (
            <article key={step.number} className="step-card-visual">
              <div className="step-number">{step.number}</div>
              <div className="step-card-text">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
              <div className="step-card-visual-wrap">
                <GuideVisual step={step.number} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Bannière d'accueil */
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <header className="hero">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-glow hero-glow-main" />
        <div className="hero-glow hero-glow-secondary" />
        <div className="hero-grid" />
      </div>
      <div className="hero-content">
        <span className="hero-badge">
          <Sparkles size={14} />
          {t.hero.badge}
        </span>
        <h1>
          {t.hero.title}
          <span className="gradient-text">{t.hero.titleAccent}</span>
        </h1>
        <p className="hero-subtitle">{t.hero.subtitle}</p>
        <div className="hero-actions">
          <a href="#generator" className="hero-cta hero-cta-primary">
            {t.hero.ctaPrimary}
            <ArrowRight size={18} />
          </a>
          <a href="#features" className="hero-cta hero-cta-secondary">
            {t.hero.ctaSecondary}
          </a>
        </div>
      </div>
    </header>
  );

}

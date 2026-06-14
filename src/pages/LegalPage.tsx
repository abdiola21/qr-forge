/** Page Mentions légales */
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Copyright,
  Shield,
  Cookie,
  AlertTriangle,
  Scale,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../i18n/LanguageContext';
import { siteConfig } from '../config/site';
import { usePageSeo } from '../hooks/usePageSeo';

export default function LegalPage() {
  const { t, lang } = useLanguage();
  const l = t.legal;
  const seo = siteConfig.seo[lang];

  usePageSeo({
    title: l.title,
    description: seo.legalDescription,
    path: '/mentions-legales',
    lang,
  });

  const tocItems = [
    { id: 'ip', label: l.ipTitle },
    { id: 'privacy', label: l.privacyTitle },
    { id: 'cookies', label: l.cookiesTitle },
    { id: 'liability', label: l.liabilityTitle },
    { id: 'law', label: l.lawTitle },
  ];

  const sections = [
    { id: 'ip', icon: Copyright, title: l.ipTitle, content: l.ipContent },
    { id: 'privacy', icon: Shield, title: l.privacyTitle, content: l.privacyContent },
    { id: 'cookies', icon: Cookie, title: l.cookiesTitle, content: l.cookiesContent },
    { id: 'liability', icon: AlertTriangle, title: l.liabilityTitle, content: l.liabilityContent },
    { id: 'law', icon: Scale, title: l.lawTitle, content: l.lawContent },
  ];

  return (
    <>
      <Navbar />
      <main className="legal-page">
        <div className="legal-bg" aria-hidden="true" />

        <div className="legal-inner">
          <Link to="/" className="legal-back">
            <ArrowLeft size={16} />
            {l.backHome}
          </Link>

          <header className="legal-header">
            <span className="section-label">{l.label}</span>
            <h1>{l.title}</h1>
            <p className="legal-updated">{l.lastUpdated}</p>
            <p className="legal-intro">{l.intro}</p>
          </header>

          <nav className="legal-toc" aria-label={l.tocLabel}>
            <p className="legal-toc-title">{l.tocLabel}</p>
            <ul>
              {tocItems.map((item, index) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="legal-toc-link">
                    <span className="legal-toc-num">{index + 1}</span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="legal-sections">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <section key={section.id} id={section.id} className="legal-section">
                  <div className="legal-section-head">
                    <div className="legal-section-icon">
                      <Icon size={20} strokeWidth={2} />
                    </div>
                    <h2>{section.title}</h2>
                  </div>
                  <div className="legal-section-body">
                    {section.content.split('\n\n').map((paragraph) => (
                      <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

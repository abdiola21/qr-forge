/** Page Guide & FAQ — contenu indexable pour le SEO */
import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, HelpCircle, BookOpen, Sparkles, LayoutGrid,
  User, Globe, FileText, Image, Video, Wifi, UtensilsCrossed,
  Briefcase, Music, Smartphone, TicketPercent, Share2, MessageCircle,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../i18n/LanguageContext';
import { siteConfig } from '../config/site';
import { usePageSeo } from '../hooks/usePageSeo';

const TYPE_ICONS: Record<string, ReactNode> = {
  vcard: <User size={22} strokeWidth={1.75} />,
  website: <Globe size={22} strokeWidth={1.75} />,
  pdf: <FileText size={22} strokeWidth={1.75} />,
  images: <Image size={22} strokeWidth={1.75} />,
  video: <Video size={22} strokeWidth={1.75} />,
  wifi: <Wifi size={22} strokeWidth={1.75} />,
  menu: <UtensilsCrossed size={22} strokeWidth={1.75} />,
  business: <Briefcase size={22} strokeWidth={1.75} />,
  mp3: <Music size={22} strokeWidth={1.75} />,
  apps: <Smartphone size={22} strokeWidth={1.75} />,
  coupon: <TicketPercent size={22} strokeWidth={1.75} />,
  facebook: <Share2 size={22} strokeWidth={1.75} />,
  whatsapp: <MessageCircle size={22} strokeWidth={1.75} />,
  social: <Share2 size={22} strokeWidth={1.75} />,
  instagram: <Share2 size={22} strokeWidth={1.75} />,
};

export default function GuidePage() {
  const { t, lang } = useLanguage();
  const g = t.guidePage;
  const seo = siteConfig.seo[lang];

  usePageSeo({
    title: g.title,
    description: seo.guideDescription,
    path: '/guide',
    lang,
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: g.faq.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    });
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, [g.faq]);

  const steps = [
    { title: t.guide.step1Title, desc: t.guide.step1Desc },
    { title: t.guide.step2Title, desc: t.guide.step2Desc },
    { title: t.guide.step3Title, desc: t.guide.step3Desc },
    { title: t.guide.step4Title, desc: t.guide.step4Desc },
  ];

  return (
    <>
      <Navbar />
      <main className="legal-page guide-page">
        <div className="legal-bg" aria-hidden="true" />

        <div className="legal-inner">
          <Link to="/" className="legal-back">
            <ArrowLeft size={16} />
            {g.backHome}
          </Link>

          <header className="legal-header">
            <span className="section-label">{g.label}</span>
            <h1>{g.title}</h1>
            <p className="legal-intro">{g.intro}</p>
          </header>

          <section className="legal-section" aria-labelledby="guide-steps-title">
            <div className="legal-section-head">
              <div className="legal-section-icon">
                <BookOpen size={20} strokeWidth={2} />
              </div>
              <h2 id="guide-steps-title">{g.stepsTitle}</h2>
            </div>
            <ol className="guide-steps-list">
              {steps.map((step, index) => (
                <li key={step.title} className="guide-step-item">
                  <span className="guide-step-num">{index + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="legal-section" aria-labelledby="guide-types-title">
            <div className="legal-section-head">
              <div className="legal-section-icon">
                <LayoutGrid size={20} strokeWidth={2} />
              </div>
              <h2 id="guide-types-title">{g.typesTitle}</h2>
            </div>
            <p className="guide-types-intro">{g.typesIntro}</p>
            <ul className="guide-types-grid">
              {g.types.map((type) => (
                <li key={type.id} className="guide-type-card">
                  <span className="guide-type-icon" aria-hidden="true">
                    {TYPE_ICONS[type.id]}
                  </span>
                  <h3>{type.name}</h3>
                  <p>{type.desc}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="legal-section" aria-labelledby="guide-faq-title">
            <div className="legal-section-head">
              <div className="legal-section-icon">
                <HelpCircle size={20} strokeWidth={2} />
              </div>
              <h2 id="guide-faq-title">{g.faqTitle}</h2>
            </div>
            <div className="guide-faq-list">
              {g.faq.map((item) => (
                <article key={item.q} className="guide-faq-item">
                  <h3>{item.q}</h3>
                  <p>{item.a}</p>
                </article>
              ))}
            </div>
          </section>

          <div className="guide-page-cta">
            <Link to="/#generator" className="hero-cta hero-cta-primary guide-page-cta-btn">
              <Sparkles size={18} />
              {g.cta}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

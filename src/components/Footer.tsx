/** Pied de page du site */
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  Gift,
  Shield,
  Sparkles,
  Layers,
  BookOpen,
  Info,
  QrCode,
  Scale,
} from 'lucide-react';
import Logo from './Logo';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import { useLanguage } from '../i18n/LanguageContext';

function FooterLink({
  href,
  to,
  children,
}: {
  href?: string;
  to?: string;
  children: React.ReactNode;
}) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  if (isHome && href) {
    return (
      <a href={href} className="footer-link">
        {children}
      </a>
    );
  }

  if (href) {
    return (
      <Link to={href.startsWith('#') ? `/${href}` : href} className="footer-link">
        {children}
      </Link>
    );
  }

  if (to) {
    return (
      <Link to={to} className="footer-link">
        {children}
      </Link>
    );
  }

  return null;
}

export default function Footer() {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const year = new Date().getFullYear();
  const f = t.footer;

  const ctaButton = (
    <>
      {f.ctaButton}
      <ArrowRight size={18} />
    </>
  );

  return (
    <footer className="footer">
      <div className="footer-pattern" aria-hidden="true" />

      <div className="footer-inner">
        <div className="footer-cta">
          <div className="footer-cta-glow" aria-hidden="true" />
          <div className="footer-cta-content">
            <span className="footer-cta-badge">
              <Sparkles size={14} />
              {f.ctaBadge}
            </span>
            <h2 className="footer-cta-title">{f.ctaTitle}</h2>
            <p className="footer-cta-subtitle">{f.ctaSubtitle}</p>
          </div>
          {isHome ? (
            <a href="#generator" className="footer-cta-btn">
              {ctaButton}
            </a>
          ) : (
            <Link to="/#generator" className="footer-cta-btn">
              {ctaButton}
            </Link>
          )}
        </div>

        <div className="footer-main">
          <div className="footer-brand">
            <Logo size={38} />
            <p className="footer-tagline">{f.tagline}</p>
            <ul className="footer-badges">
              <li>
                <Gift size={15} strokeWidth={2} />
                {f.badgeFree}
              </li>
              <li>
                <Shield size={15} strokeWidth={2} />
                {f.badgePrivate}
              </li>
              <li>
                <Sparkles size={15} strokeWidth={2} />
                {f.badgeQuality}
              </li>
            </ul>
          </div>

          <nav className="footer-nav" aria-label="Footer">
            <div className="footer-nav-group">
              <span className="footer-nav-label">
                <Layers size={14} />
                {f.navProduct}
              </span>
              <FooterLink href="#features">{f.featuresLink}</FooterLink>
              <FooterLink href="#guide">{f.guideLink}</FooterLink>
              <FooterLink href="#about">{f.aboutLink}</FooterLink>
              <FooterLink href="#generator">
                <QrCode size={15} />
                {f.createQrLink}
              </FooterLink>
            </div>

            <div className="footer-nav-group">
              <span className="footer-nav-label">
                <BookOpen size={14} />
                {f.navResources}
              </span>
              <FooterLink href="#guide">{f.guideLink}</FooterLink>
              <FooterLink href="#features">{f.featuresLink}</FooterLink>
              <FooterLink href="#about">{f.aboutLink}</FooterLink>
            </div>

            <div className="footer-nav-group">
              <span className="footer-nav-label">
                <Scale size={14} />
                {f.navLegal}
              </span>
              <FooterLink to="/mentions-legales">
                <Info size={15} />
                {f.legalNotice}
              </FooterLink>
            </div>
          </nav>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © {year} <span className="footer-copy-brand">QR Forge</span>. {f.copyright}
          </p>
          <p className="footer-privacy">{f.privacyNote}</p>
          <div className="footer-bottom-tools">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}

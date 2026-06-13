import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';
import { useLanguage } from '../i18n/LanguageContext';

function NavAnchor({
  href,
  to,
  children,
  onClick,
  className = 'nav-link',
}: {
  href?: string;
  to?: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  if (isHome && href) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }
  if (to) {
    return (
      <Link to={to} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return null;
}

export default function Navbar() {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const navLinks = (
    <>
      <NavAnchor href="#features" to="/#features" onClick={closeMenu}>
        {t.nav.features}
      </NavAnchor>
      <NavAnchor href="#about" to="/#about" onClick={closeMenu}>
        {t.nav.about}
      </NavAnchor>
      <ThemeToggle />
      <LanguageToggle />
      {isHome ? (
        <a href="#generator" className="nav-cta" onClick={closeMenu}>
          {t.nav.createQr}
        </a>
      ) : (
        <Link to="/#generator" className="nav-cta" onClick={closeMenu}>
          {t.nav.createQr}
        </Link>
      )}
    </>
  );

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <Logo size={34} />
        </Link>

        <div className="nav-actions nav-actions-desktop">{navLinks}</div>

        <button
          type="button"
          className="nav-burger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <button
          type="button"
          className="nav-overlay"
          aria-label={t.nav.closeMenu}
          onClick={closeMenu}
        />
      )}

      <div className={`nav-mobile-menu ${menuOpen ? 'open' : ''}`}>
        <NavAnchor href="#features" to="/#features" onClick={closeMenu} className="nav-mobile-link">
          {t.nav.features}
        </NavAnchor>
        <NavAnchor href="#about" to="/#about" onClick={closeMenu} className="nav-mobile-link">
          {t.nav.about}
        </NavAnchor>
        <div className="nav-mobile-tools">
          <ThemeToggle />
          <LanguageToggle />
        </div>
        {isHome ? (
          <a href="#generator" className="nav-cta nav-mobile-cta" onClick={closeMenu}>
            {t.nav.createQr}
          </a>
        ) : (
          <Link to="/#generator" className="nav-cta nav-mobile-cta" onClick={closeMenu}>
            {t.nav.createQr}
          </Link>
        )}
      </div>
    </nav>
  );
}

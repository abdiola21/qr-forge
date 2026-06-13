import { useLanguage } from '../i18n/LanguageContext';

export default function LanguageToggle() {
  const { lang, setLang, t } = useLanguage();

  const toggle = () => setLang(lang === 'fr' ? 'en' : 'fr');

  return (
    <button
      type="button"
      className="lang-toggle"
      onClick={toggle}
      aria-label={t.lang.switchTo}
      title={t.lang.switchTo}
    >
      <span className={lang === 'fr' ? 'lang-active' : 'lang-inactive'}>{t.lang.fr}</span>
      <span className="lang-separator">|</span>
      <span className={lang === 'en' ? 'lang-active' : 'lang-inactive'}>{t.lang.en}</span>
    </button>
  );
}

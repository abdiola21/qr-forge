import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import QrGenerator from '../components/QrGenerator';
import AboutSection from '../components/AboutSection';
import FeaturesSection from '../components/FeaturesSection';
import GuideSection from '../components/GuideSection';
import Footer from '../components/Footer';
import { useLanguage } from '../i18n/LanguageContext';
import { siteConfig } from '../config/site';
import { usePageSeo } from '../hooks/usePageSeo';

export default function HomePage() {
  const { lang } = useLanguage();
  const seo = siteConfig.seo[lang];

  usePageSeo({
    title: seo.homeTitle,
    description: seo.homeDescription,
    path: '/',
    lang,
  });

  return (
    <>
      <Navbar />
      <Hero />
      <QrGenerator />
      <FeaturesSection />
      <GuideSection />
      <AboutSection />
      <Footer />
    </>
  );
}

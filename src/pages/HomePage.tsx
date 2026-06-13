import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import QrGenerator from '../components/QrGenerator';
import AboutSection from '../components/AboutSection';
import FeaturesSection from '../components/FeaturesSection';
import GuideSection from '../components/GuideSection';
import Footer from '../components/Footer';

export default function HomePage() {
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

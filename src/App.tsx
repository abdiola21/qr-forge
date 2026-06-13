/** Point d'entrée de l'application — routage des pages */
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import GoogleAnalytics from './components/GoogleAnalytics';
import HomePage from './pages/HomePage';
import LegalPage from './pages/LegalPage';
import BackgroundAnimation from './components/BackgroundAnimation';
import PageLoader from './components/PageLoader';
import ScrollToTop from './components/ScrollToTop';
import ScrollToAnchor from './components/ScrollToAnchor';

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <div className={`app${loading ? ' app--loading' : ''}`}>
      {loading && <PageLoader onComplete={() => setLoading(false)} />}
      <ScrollToTop />
      <ScrollToAnchor />
      <BackgroundAnimation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mentions-legales" element={<LegalPage />} />
      </Routes>
      <Analytics />
      <GoogleAnalytics />
    </div>
  );
}

/** Écran de chargement initial — animation QR + logo QR Forge */
import { useEffect, useState } from 'react';
import Logo from './Logo';
import { useLanguage } from '../i18n/LanguageContext';

const MIN_DURATION = 1400;
const EXIT_DURATION = 550;

/** Motif 7×7 évoquant un QR code (1 = module actif) */
const QR_PATTERN = [
  [1, 1, 1, 0, 1, 1, 1],
  [1, 0, 1, 0, 1, 0, 1],
  [1, 1, 1, 0, 1, 1, 1],
  [0, 0, 0, 1, 0, 0, 0],
  [1, 1, 1, 0, 0, 1, 0],
  [1, 0, 0, 1, 0, 0, 1],
  [1, 1, 0, 1, 1, 1, 1],
] as const;

interface PageLoaderProps {
  onComplete: () => void;
}

export default function PageLoader({ onComplete }: PageLoaderProps) {
  const { t } = useLanguage();
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    document.body.classList.add('page-loading');

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const minDuration = reducedMotion ? 350 : MIN_DURATION;
    const start = performance.now();
    let cancelled = false;

    const finish = () => {
      if (cancelled) return;
      const elapsed = performance.now() - start;
      const remaining = Math.max(0, minDuration - elapsed);
      window.setTimeout(() => setExiting(true), remaining);
    };

    const waitForReady = async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready.catch(() => undefined);
      }

      if (document.readyState === 'complete') {
        finish();
        return;
      }

      window.addEventListener('load', finish, { once: true });
    };

    void waitForReady();

    return () => {
      cancelled = true;
      document.body.classList.remove('page-loading');
    };
  }, []);

  useEffect(() => {
    if (!exiting) return;

    const timer = window.setTimeout(() => {
      document.body.classList.remove('page-loading');
      onComplete();
    }, EXIT_DURATION);

    return () => window.clearTimeout(timer);
  }, [exiting, onComplete]);

  return (
    <div
      className={`page-loader${exiting ? ' page-loader--exiting' : ''}`}
      role="status"
      aria-live="polite"
      aria-label={t.loader.loading}
    >
      <div className="page-loader-glow" aria-hidden="true" />

      <div className="page-loader-content">
        <Logo size={52} />

        <div className="page-loader-qr" aria-hidden="true">
          <div className="page-loader-qr-grid">
            {QR_PATTERN.flatMap((row, y) =>
              row.map((active, x) => (
                <span
                  key={`${x}-${y}`}
                  className={`page-loader-qr-cell${active ? ' page-loader-qr-cell--active' : ''}`}
                  style={
                    active
                      ? {
                          animationDelay: `${(x + y) * 0.045}s`,
                        }
                      : undefined
                  }
                />
              )),
            )}
          </div>
          <div className="page-loader-scan" />
        </div>

        <p className="page-loader-text">{t.loader.loading}</p>

        <div className="page-loader-progress" aria-hidden="true">
          <div className="page-loader-progress-bar" />
        </div>
      </div>
    </div>
  );
}

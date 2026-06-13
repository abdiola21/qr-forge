/** Maquette iPhone 17 — aperçu vide ou QR généré */
import type { RefObject } from 'react';
import { LogoIcon } from './Logo';

interface PhonePreviewMockupProps {
  hint: string;
  readyHint: string;
  valid: boolean;
  qrContainerRef?: RefObject<HTMLDivElement | null>;
  qrBackground?: string;
}

/** Motif QR simplifié pour l'aperçu vide */
function DemoQrPattern() {
  const cells = [
    '111111111111111',
    '100000000000001',
    '101111011111101',
    '101111011111101',
    '101111011111101',
    '100000000000001',
    '111111101111111',
    '000000101000000',
    '111011101110111',
    '100010001000101',
    '101110111011101',
    '100010101000101',
    '111111111111111',
  ];

  return (
    <svg viewBox="0 0 130 130" className="phone-demo-qr" aria-hidden="true">
      {cells.map((row, y) =>
        row.split('').map((cell, x) =>
          cell === '1' ? (
            <rect key={`${x}-${y}`} x={x * 10} y={y * 10} width={10} height={10} fill="#111" />
          ) : null,
        ),
      )}
    </svg>
  );
}

export default function PhonePreviewMockup({
  hint,
  readyHint,
  valid,
  qrContainerRef,
  qrBackground,
}: PhonePreviewMockupProps) {
  return (
    <div className={`phone-mockup iphone17${valid ? ' phone-mockup--ready' : ''}`}>
      <div className="iphone17-shell">
        <span className="iphone17-side-btn iphone17-side-btn--vol-up" />
        <span className="iphone17-side-btn iphone17-side-btn--vol-down" />
        <span className="iphone17-side-btn iphone17-side-btn--power" />

        <div className="iphone17-body">
          <div className="iphone17-screen">
            <div className="iphone17-dynamic-island">
              <span className="iphone17-island-cam" />
            </div>

            <div className="iphone17-status">
              <span className="iphone17-time">9:41</span>
              <span className="iphone17-status-icons">
                <svg viewBox="0 0 18 12" className="iphone17-signal" aria-hidden="true">
                  <rect x="0" y="7" width="3" height="5" rx="0.5" fill="currentColor" />
                  <rect x="5" y="5" width="3" height="7" rx="0.5" fill="currentColor" />
                  <rect x="10" y="2" width="3" height="10" rx="0.5" fill="currentColor" />
                  <rect x="15" y="0" width="3" height="12" rx="0.5" fill="currentColor" />
                </svg>
                <svg viewBox="0 0 16 12" className="iphone17-wifi" aria-hidden="true">
                  <path
                    d="M8 11.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM3.2 6.4a7.2 7.2 0 0 1 9.6 0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M1 3.8a10.5 10.5 0 0 1 14 0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
                <svg viewBox="0 0 27 13" className="iphone17-battery" aria-hidden="true">
                  <rect x="0.5" y="0.5" width="22" height="12" rx="3" fill="none" stroke="currentColor" strokeWidth="1" />
                  <rect x="2.5" y="2.5" width="17" height="8" rx="1.5" fill="currentColor" />
                  <path d="M24 4.5v4a1.5 1.5 0 0 0 0-4Z" fill="currentColor" />
                </svg>
              </span>
            </div>

            <div
              className={`phone-mockup-qr-area${valid ? ' phone-mockup-qr-area--live' : ''}`}
              style={valid && qrBackground ? { background: qrBackground } : undefined}
            >
              {!valid && (
                <>
                  <span className="phone-scan-corner phone-scan-corner--tl" />
                  <span className="phone-scan-corner phone-scan-corner--tr" />
                  <span className="phone-scan-corner phone-scan-corner--bl" />
                  <span className="phone-scan-corner phone-scan-corner--br" />
                </>
              )}

              <div className="phone-demo-qr-wrap">
                {valid && qrContainerRef ? (
                  <div ref={qrContainerRef} className="qr-preview phone-qr-preview" />
                ) : (
                  <>
                    <DemoQrPattern />
                    <span className="phone-scan-line" />
                    <div className="phone-demo-logo">
                      <LogoIcon size={24} />
                    </div>
                  </>
                )}
              </div>
            </div>

            <p className="phone-mockup-hint">{valid ? readyHint : hint}</p>
            <div className="iphone17-home-indicator" />
          </div>
        </div>
      </div>
    </div>
  );
}

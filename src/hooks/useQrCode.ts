/** Hook personnalisé pour générer et exporter le QR code */
import { useEffect, useRef, useCallback } from 'react';
import QRCodeStyling from 'qr-code-styling';
import type { QrDesign } from '../types/qr';

interface UseQrCodeOptions {
  data: string;
  design: QrDesign;
  /** Logo effectif (upload perso ou auto-logo réseau social) */
  logoUrl?: string | null;
  size?: number;
}

function buildImageOptions(logoUrl: string | null | undefined, logoSize: number) {
  const options = { margin: 8, imageSize: logoSize / 100 };
  if (logoUrl && !logoUrl.startsWith('data:')) {
    return { ...options, crossOrigin: 'anonymous' as const };
  }
  return options;
}

function buildQrOptions(
  data: string,
  design: QrDesign,
  size: number,
  logoUrl: string | null | undefined,
) {
  return {
    width: size,
    height: size,
    type: 'svg' as const,
    data: data || ' ',
    margin: design.margin,
    qrOptions: { errorCorrectionLevel: 'H' as const },
    dotsOptions: { color: design.foregroundColor, type: design.dotStyle },
    cornersSquareOptions: { color: design.foregroundColor, type: design.cornerSquareStyle },
    cornersDotOptions: { color: design.foregroundColor, type: design.cornerDotStyle },
    backgroundOptions: { color: design.backgroundColor },
    imageOptions: buildImageOptions(logoUrl, design.logoSize),
    ...(logoUrl ? { image: logoUrl } : {}),
  };
}

/** Vérifie qu'une image (data URL ou URL) est chargeable */
function canLoadImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    if (!url.startsWith('data:')) img.crossOrigin = 'anonymous';
    img.src = url;
  });
}

export function useQrCode({ data, design, logoUrl = null, size = 280 }: UseQrCodeOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function renderQr() {
      const container = containerRef.current;
      if (!container) return;

      let safeLogo = logoUrl;
      if (logoUrl) {
        const ok = await canLoadImage(logoUrl);
        if (cancelled) return;
        if (!ok) safeLogo = null;
      }

      const options = buildQrOptions(data, design, size, safeLogo);

      if (!qrRef.current) {
        qrRef.current = new QRCodeStyling(options);
      } else {
        qrRef.current.update(options);
      }

      // qr-code-styling charge le logo de façon asynchrone
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, safeLogo ? 120 : 0);
      });
      if (cancelled || containerRef.current !== container) return;

      container.innerHTML = '';
      qrRef.current.append(container);
    }

    void renderQr();

    return () => {
      cancelled = true;
    };
  }, [data, design, logoUrl, size]);

  const downloadPng = useCallback(async () => {
    if (!qrRef.current) return;
    await qrRef.current.download({ name: 'qr-code', extension: 'png' });
  }, []);

  const downloadPdf = useCallback(async () => {
    if (!qrRef.current) return;
    const blob = await qrRef.current.getRawData('png');
    if (!blob) return;

    const { jsPDF } = await import('jspdf');
    const imgUrl = URL.createObjectURL(blob as Blob);
    const img = new Image();

    await new Promise<void>((resolve) => {
      img.onload = () => {
        const pdfSize = 210;
        const margin = 20;
        const imgSize = pdfSize - margin * 2;
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 0, pdfSize, pdfSize, 'F');
        pdf.addImage(img, 'PNG', margin, margin, imgSize, imgSize);
        pdf.save('qr-code.pdf');
        URL.revokeObjectURL(imgUrl);
        resolve();
      };
      img.src = imgUrl;
    });
  }, []);

  const downloadSvg = useCallback(async () => {
    if (!qrRef.current) return;
    await qrRef.current.download({ name: 'qr-code', extension: 'svg' });
  }, []);

  return { containerRef, downloadPng, downloadPdf, downloadSvg };
}

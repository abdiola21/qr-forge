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

export function useQrCode({ data, design, logoUrl = null, size = 280 }: UseQrCodeOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);
  const imageOptions = buildImageOptions(logoUrl, design.logoSize);

  // Initialisation unique de l'instance QR
  useEffect(() => {
    if (!qrRef.current) {
      qrRef.current = new QRCodeStyling({
        width: size,
        height: size,
        type: 'svg',
        data: data || ' ',
        margin: design.margin,
        qrOptions: { errorCorrectionLevel: 'H' },
        dotsOptions: { color: design.foregroundColor, type: design.dotStyle },
        cornersSquareOptions: { color: design.foregroundColor, type: design.cornerSquareStyle },
        cornersDotOptions: { color: design.foregroundColor, type: design.cornerDotStyle },
        backgroundOptions: { color: design.backgroundColor },
        imageOptions,
        ...(logoUrl ? { image: logoUrl } : {}),
      });
    }
  }, []);

  // Mise à jour du rendu à chaque changement de données ou de design
  useEffect(() => {
    if (!qrRef.current || !containerRef.current) return;

    qrRef.current.update({
      width: size,
      height: size,
      data: data || ' ',
      margin: design.margin,
      dotsOptions: { color: design.foregroundColor, type: design.dotStyle },
      cornersSquareOptions: { color: design.foregroundColor, type: design.cornerSquareStyle },
      cornersDotOptions: { color: design.foregroundColor, type: design.cornerDotStyle },
      backgroundOptions: { color: design.backgroundColor },
      imageOptions: buildImageOptions(logoUrl, design.logoSize),
      image: logoUrl || undefined,
    });

    containerRef.current.innerHTML = '';
    qrRef.current.append(containerRef.current);
  }, [data, design, logoUrl, size]);

  const downloadPng = useCallback(async () => {
    if (!qrRef.current) return;
    await qrRef.current.download({ name: 'qr-code', extension: 'png' });
  }, []);

  const downloadPdf = useCallback(async () => {
    if (!qrRef.current) return;
    const blob = await qrRef.current.getRawData('png');
    if (!blob) return;

    // Conversion PNG → PDF au format A4
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

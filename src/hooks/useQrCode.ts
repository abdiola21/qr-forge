/** Hook personnalisé pour générer et exporter le QR code */
import { useLayoutEffect, useRef, useCallback } from 'react';
import QRCodeStyling from 'qr-code-styling';
import type { QrDesign } from '../types/qr';

interface UseQrCodeOptions {
  data: string;
  design: QrDesign;
  /** Logo effectif (upload perso ou auto-logo réseau social) */
  logoUrl?: string | null;
  size?: number;
  /** Désactiver le rendu (ex. formulaire invalide) */
  enabled?: boolean;
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

function canLoadImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    if (!url.startsWith('data:')) img.crossOrigin = 'anonymous';
    img.src = url;
  });
}

async function waitForQrDraw(qr: QRCodeStyling) {
  await qr.getRawData('svg');
}

async function resolveSafeLogo(logoUrl: string | null | undefined) {
  if (!logoUrl) return null;
  const ok = await canLoadImage(logoUrl);
  return ok ? logoUrl : null;
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Lecture du fichier impossible'));
    reader.readAsDataURL(blob);
  });
}

/** Convertit le SVG déjà rendu (aperçu) en PNG via canvas.
 * Pour une meilleure netteté, on rasterise à plus haute résolution puis on télécharge.
 */
async function exportPngFromQr(
  qr: QRCodeStyling,
  size: number,
  exportScale: number,
): Promise<Blob> {
  await waitForQrDraw(qr);
  const raw = await qr.getRawData('svg');
  if (!(raw instanceof Blob)) throw new Error('Export SVG impossible');

  const svgText = await raw.text();
  const svgUrl = URL.createObjectURL(
    new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' }),
  );

  try {
    return await new Promise<Blob>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const outSize = Math.max(1, Math.round(size * exportScale));
        canvas.width = outSize;
        canvas.height = outSize;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) {
          reject(new Error('Canvas indisponible'));
          return;
        }
        // Évite le lissage lors du scaling SVG→bitmap
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, outSize, outSize);
        canvas.toBlob(
          (pngBlob) => {
            if (pngBlob) resolve(pngBlob);
            else reject(new Error('Conversion PNG impossible'));
          },
          'image/png',
          1,
        );
      };
      img.onerror = () => reject(new Error('Rasterisation SVG impossible'));
      img.src = svgUrl;
    });
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

function triggerFileDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Laisser le navigateur démarrer le téléchargement avant de révoquer l'URL
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function useQrCode({
  data,
  design,
  logoUrl = null,
  size = 280,
  enabled = true,
}: UseQrCodeOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);
  const attachedContainerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!enabled) {
      qrRef.current = null;
      attachedContainerRef.current = null;
      return;
    }

    let cancelled = false;
    let retryTimer: ReturnType<typeof window.setTimeout> | undefined;

    async function renderQr(attempt = 0) {
      const container = containerRef.current;
      if (!container) {
        if (attempt < 5 && !cancelled) {
          retryTimer = window.setTimeout(() => void renderQr(attempt + 1), 16);
        }
        return;
      }

      const safeLogo = await resolveSafeLogo(logoUrl);
      if (cancelled) return;

      const options = buildQrOptions(data, design, size, safeLogo);
      const needsNewInstance =
        !qrRef.current || attachedContainerRef.current !== container;

      if (needsNewInstance) {
        container.replaceChildren();
        qrRef.current = new QRCodeStyling(options);
        qrRef.current.append(container);
        attachedContainerRef.current = container;
      } else {
        qrRef.current!.update(options);
      }

      try {
        const qr = qrRef.current;
        if (!qr) return;
        await waitForQrDraw(qr);
      } catch {
        if (cancelled) return;
        container.replaceChildren();
        const fallback = new QRCodeStyling(buildQrOptions(data, design, size, null));
        qrRef.current = fallback;
        attachedContainerRef.current = container;
        fallback.append(container);
        await waitForQrDraw(fallback);
      }
    }

    void renderQr();

    return () => {
      cancelled = true;
      if (retryTimer !== undefined) window.clearTimeout(retryTimer);
      qrRef.current = null;
      attachedContainerRef.current = null;
    };
  }, [enabled, data, design, logoUrl, size]);

  const downloadPng = useCallback(async () => {
    if (!qrRef.current) return;
    // Rasteriser à plus haute résolution pour une meilleure netteté
    const blob = await exportPngFromQr(qrRef.current, size, 3);
    triggerFileDownload(blob, 'qr-code.png');
  }, [size]);

  const downloadPdf = useCallback(async () => {
    if (!qrRef.current) return;
    const blob = await exportPngFromQr(qrRef.current, size, 3);
    const dataUrl = await blobToDataUrl(blob);
    const { jsPDF } = await import('jspdf');
    const pdfSize = 210;
    const margin = 20;
    const imgSize = pdfSize - margin * 2;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pdfSize, pdfSize, 'F');
    pdf.addImage(dataUrl, 'PNG', margin, margin, imgSize, imgSize);
    pdf.save('qr-code.pdf');
  }, [size]);

  const downloadSvg = useCallback(async () => {
    if (!qrRef.current) return;
    await waitForQrDraw(qrRef.current);
    await qrRef.current.download({ name: 'qr-code', extension: 'svg' });
  }, []);

  return { containerRef, downloadPng, downloadPdf, downloadSvg };
}

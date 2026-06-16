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
  renderType: 'svg' | 'canvas' = 'svg',
) {
  return {
    width: size,
    height: size,
    type: renderType,
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

/** Export PNG via une instance canvas dédiée (fiable vs conversion SVG→canvas) */
async function exportPngBlob(
  data: string,
  design: QrDesign,
  size: number,
  logoUrl: string | null | undefined,
): Promise<Blob> {
  const safeLogo = await resolveSafeLogo(logoUrl);

  async function render(withLogo: string | null | undefined) {
    const exporter = new QRCodeStyling(buildQrOptions(data, design, size, withLogo, 'canvas'));
    const blob = await exporter.getRawData('png');
    if (blob instanceof Blob) return blob;
    throw new Error('PNG export failed');
  }

  try {
    return await render(safeLogo);
  } catch {
    if (safeLogo) return render(null);
    throw new Error('PNG export failed');
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
  URL.revokeObjectURL(url);
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

      const options = buildQrOptions(data, design, size, safeLogo, 'svg');
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
        const fallback = new QRCodeStyling(buildQrOptions(data, design, size, null, 'svg'));
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
    const blob = await exportPngBlob(data, design, size, logoUrl);
    triggerFileDownload(blob, 'qr-code.png');
  }, [data, design, size, logoUrl]);

  const downloadPdf = useCallback(async () => {
    const blob = await exportPngBlob(data, design, size, logoUrl);
    const { jsPDF } = await import('jspdf');
    const imgUrl = URL.createObjectURL(blob);
    const img = new Image();

    await new Promise<void>((resolve, reject) => {
      img.onload = () => {
        try {
          const pdfSize = 210;
          const margin = 20;
          const imgSize = pdfSize - margin * 2;
          const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
          pdf.setFillColor(255, 255, 255);
          pdf.rect(0, 0, pdfSize, pdfSize, 'F');
          pdf.addImage(img, 'PNG', margin, margin, imgSize, imgSize);
          pdf.save('qr-code.pdf');
          resolve();
        } catch (error) {
          reject(error);
        } finally {
          URL.revokeObjectURL(imgUrl);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(imgUrl);
        reject(new Error('PDF export failed'));
      };
      img.src = imgUrl;
    });
  }, [data, design, size, logoUrl]);

  const downloadSvg = useCallback(async () => {
    if (!qrRef.current) return;
    await waitForQrDraw(qrRef.current);
    await qrRef.current.download({ name: 'qr-code', extension: 'svg' });
  }, []);

  return { containerRef, downloadPng, downloadPdf, downloadSvg };
}

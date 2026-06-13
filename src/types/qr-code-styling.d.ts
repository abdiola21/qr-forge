/** Déclarations TypeScript pour la bibliothèque qr-code-styling */
declare module 'qr-code-styling' {
  interface QRCodeStylingOptions {
    width?: number;
    height?: number;
    type?: 'canvas' | 'svg';
    data?: string;
    margin?: number;
    qrOptions?: { errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H' };
    dotsOptions?: { color?: string; type?: string };
    cornersSquareOptions?: { color?: string; type?: string };
    cornersDotOptions?: { color?: string; type?: string };
    backgroundOptions?: { color?: string };
    imageOptions?: { crossOrigin?: string; margin?: number; imageSize?: number };
    image?: string;
  }

  export default class QRCodeStyling {
    constructor(options: QRCodeStylingOptions);
    update(options: QRCodeStylingOptions): void;
    append(container: HTMLElement): void;
    download(options: { name: string; extension: 'png' | 'jpeg' | 'webp' | 'svg' }): Promise<void>;
    getRawData(extension: 'png' | 'jpeg' | 'webp' | 'svg'): Promise<Blob | Buffer | null>;
  }
}

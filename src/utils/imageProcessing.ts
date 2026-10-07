import type { SelectedImage } from '../types';

/** The same rules as the mobile app, so both send similar images to the server. */
export const IMAGE_RULES = {
  maxSourceBytes: 30 * 1024 * 1024,
  minSide: 512,
  maxLongSide: 2048,
  quality: 0.85,
} as const;

export const ACCEPTED_IMAGE_TYPES = 'image/jpeg,image/png,image/webp,image/heic,image/heif';

export class ImageValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImageValidationError';
  }
}

async function decode(file: File): Promise<ImageBitmap> {
  try {
    return await createImageBitmap(file);
  } catch {
    throw new ImageValidationError(
      'This image could not be opened in your browser. Please use a JPEG, PNG or WEBP photo.',
    );
  }
}

function canvasToJpeg(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Could not compress image'))),
      'image/jpeg',
      IMAGE_RULES.quality,
    );
  });
}

/**
 * Checks a chosen file and prepares it for upload: it must be an image under 30 MB
 * and at least 512 px on its shorter side. Large images are scaled down to 2048 px
 * and saved as JPEG (85% quality), all inside the browser.
 */
export async function prepareImage(file: File): Promise<SelectedImage> {
  if (file.type && !file.type.startsWith('image/')) {
    throw new ImageValidationError('Please choose a photo (JPEG, PNG or WEBP).');
  }
  if (file.size > IMAGE_RULES.maxSourceBytes) {
    throw new ImageValidationError('This image is too large. Please choose a photo under 30 MB.');
  }

  const bitmap = await decode(file);
  try {
    const { width, height } = bitmap;
    if (Math.min(width, height) < IMAGE_RULES.minSide) {
      throw new ImageValidationError(
        `This image is too small. Please use a photo at least ${IMAGE_RULES.minSide} pixels wide and tall.`,
      );
    }

    const scale = Math.min(1, IMAGE_RULES.maxLongSide / Math.max(width, height));
    const outWidth = Math.round(width * scale);
    const outHeight = Math.round(height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = outWidth;
    canvas.height = outHeight;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas not available');
    // White background so transparent PNGs don't turn black when saved as JPEG.
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, outWidth, outHeight);
    context.imageSmoothingQuality = 'high';
    context.drawImage(bitmap, 0, 0, outWidth, outHeight);

    const blob = await canvasToJpeg(canvas);
    const baseName = file.name.replace(/\.[^.]+$/, '') || 'image';
    const prepared = new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' });

    return { file: prepared, previewUrl: URL.createObjectURL(prepared), width: outWidth, height: outHeight };
  } finally {
    bitmap.close();
  }
}

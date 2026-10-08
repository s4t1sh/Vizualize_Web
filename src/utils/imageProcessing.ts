import type { SelectedImage } from '../types';

/**
 * No size or type limits: any image the browser can open is accepted.
 * Very large images are only scaled down to 2048 px (to keep uploads fast); small ones are kept as they are.
 */
export const IMAGE_RULES = {
  maxLongSide: 2048,
  quality: 0.85,
} as const;

/** Lets the file chooser show every kind of image. */
export const ACCEPTED_IMAGE_TYPES = 'image/*';

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
    throw new ImageValidationError('This file could not be opened as an image in your browser. Please try another photo.');
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
 * Prepares any chosen image for upload (no minimum size, no maximum size, any format the
 * browser can open). Images larger than 2048 px are scaled down; everything is saved as
 * JPEG (85% quality), all inside the browser.
 */
export async function prepareImage(file: File): Promise<SelectedImage> {
  const bitmap = await decode(file);
  try {
    const { width, height } = bitmap;
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

/** Small preview (640 px) used for gallery cards so the library loads quickly. */
export async function makeThumbnail(file: File, maxSide = 640): Promise<File> {
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas not available');
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.imageSmoothingQuality = 'high';
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await canvasToJpeg(canvas);
    return new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' });
  } finally {
    bitmap.close();
  }
}

import type { Generation } from '../types';

export function countImages(generation: Generation) {
  const done = generation.images.filter((img) => img.status === 'completed').length;
  const failed = generation.images.filter((img) => img.status === 'failed').length;
  const total = generation.images.length;
  return { done, failed, total, waiting: total - done - failed };
}

/** Short status line, e.g. "Creating… 3 of 6 ready" or "6 pictures". */
export function describeGeneration(generation: Generation): string {
  const { done, failed, total, waiting } = countImages(generation);
  if (waiting > 0) return `Creating… ${done} of ${total} ready`;
  if (failed === total) return 'Could not be created';
  if (failed > 0) return `${done} pictures · ${failed} failed`;
  return `${done} pictures`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Saves a picture to the computer/phone (works for pictures stored on the Vizualizer server). */
export async function downloadPicture(url: string, fileName: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Download failed (${response.status})`);
  const blob = await response.blob();
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 10_000);
}

/** e.g. "vizualizer-statuario-marble-kitchen.jpg" */
export function pictureFileName(sampleName: string, spaceLabel: string, url: string) {
  const slug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const ext = url.split('?')[0]?.split('.').pop()?.toLowerCase();
  return `vizualizer-${slug(sampleName)}-${slug(spaceLabel)}.${ext && ext.length <= 4 ? ext : 'jpg'}`;
}

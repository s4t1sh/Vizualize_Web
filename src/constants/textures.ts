import type { PriceUnit, TextureCategory } from '../types';

export const TEXTURE_CATEGORIES: { value: TextureCategory; label: string }[] = [
  { value: 'granite', label: 'Granite' },
  { value: 'marble', label: 'Marble' },
  { value: 'tile', label: 'Tile' },
  { value: 'wood', label: 'Wood' },
  { value: 'stone', label: 'Stone' },
];

export const CATEGORY_LABEL: Record<TextureCategory, string> = Object.fromEntries(
  TEXTURE_CATEGORIES.map((c) => [c.value, c.label]),
) as Record<TextureCategory, string>;

export const PRICE_UNITS: { value: PriceUnit; label: string }[] = [
  { value: 'sq_ft', label: 'per sq ft' },
  { value: 'sq_m', label: 'per sq m' },
  { value: 'piece', label: 'per piece' },
  { value: 'box', label: 'per box' },
];

export const PRICE_UNIT_SHORT: Record<PriceUnit, string> = {
  sq_ft: 'sq ft',
  sq_m: 'sq m',
  piece: 'piece',
  box: 'box',
};

/** Suggestions shown while typing the finish (any text is allowed). */
export const FINISH_SUGGESTIONS = ['Polished', 'Matt', 'Honed', 'Leathered', 'Glossy', 'Satin', 'Textured', 'Flamed'];

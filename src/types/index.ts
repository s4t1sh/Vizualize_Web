export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

/** An image chosen on the website, already resized and compressed, ready to upload. */
export interface SelectedImage {
  file: File;
  /** Temporary browser link used to show the preview. */
  previewUrl: string;
  width: number;
  height: number;
}

/** A scene the AI generates using the chosen surface. */
export type SpaceType =
  | 'living_room_floor'
  | 'bedroom_floor'
  | 'kitchen'
  | 'bathroom'
  | 'staircase'
  | 'feature_wall';

export type TextureCategory = 'granite' | 'marble' | 'tile' | 'wood' | 'stone';
export type PriceUnit = 'sq_ft' | 'sq_m' | 'piece' | 'box';

/** A surface sample from the library (added with "Upload Surface"). */
export interface Texture {
  id: string;
  name: string;
  category: TextureCategory;
  size: string | null;
  finish: string | null;
  priceAmount: number | null;
  priceUnit: PriceUnit;
  imageUrl: string;
  thumbnailUrl: string;
  createdAt: string;
}

export type GenerationStatus = 'pending' | 'processing' | 'completed' | 'failed';

/** One AI picture (one per space). */
export interface GenerationImage {
  id: string;
  space: SpaceType;
  status: GenerationStatus;
  imageUrl: string | null;
  errorMessage: string | null;
}

/** One visualization: a sample shown in six spaces. */
export interface Generation {
  id: string;
  textureId: string | null;
  textureName: string;
  textureImageUrl: string;
  prompt: string;
  status: GenerationStatus;
  createdAt: string;
  images: GenerationImage[];
  /** True when you created it (only you can retry its pictures or delete it). */
  isMine: boolean;
  /** The sample's type and price (empty if the sample was deleted from the library). */
  textureCategory: TextureCategory | null;
  texturePriceAmount: number | null;
  texturePriceUnit: PriceUnit | null;
}

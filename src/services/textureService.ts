import { api, type ApiSuccess } from './api';
import type { PriceUnit, Texture, TextureCategory } from '../types';

/** Every sample in the library. */
export async function getTextures(): Promise<Texture[]> {
  const res = await api.get<ApiSuccess<{ textures: Texture[] }>>('/textures');
  return res.data.data.textures;
}

export interface TextureFormValues {
  name: string;
  category: TextureCategory;
  size: string;
  finish: string;
  priceAmount: string;
  priceUnit: PriceUnit;
}

function toFormData(values: Partial<TextureFormValues>, images?: { image: File; thumbnail: File }) {
  const form = new FormData();
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined) form.append(key, String(value));
  }
  if (images) {
    form.append('image', images.image);
    form.append('thumbnail', images.thumbnail);
  }
  return form;
}

// Uploads can take longer than normal requests.
const UPLOAD_TIMEOUT = 60000;

export async function createTexture(values: TextureFormValues, images: { image: File; thumbnail: File }) {
  const res = await api.post<ApiSuccess<{ texture: Texture }>>('/textures', toFormData(values, images), {
    timeout: UPLOAD_TIMEOUT,
  });
  return res.data.data.texture;
}

export async function updateTexture(
  id: string,
  values: Partial<TextureFormValues>,
  images?: { image: File; thumbnail: File },
) {
  const res = await api.patch<ApiSuccess<{ texture: Texture }>>(`/textures/${id}`, toFormData(values, images), {
    timeout: UPLOAD_TIMEOUT,
  });
  return res.data.data.texture;
}

export async function deleteTexture(id: string) {
  await api.delete(`/textures/${id}`);
}

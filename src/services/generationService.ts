import { api, type ApiSuccess } from './api';
import type { Generation, SpaceType } from '../types';

type One = ApiSuccess<{ generation: Generation }>;

/** Starts a visualization (six AI pictures are then created on the server). */
export async function createGeneration(textureId: string, prompt: string, spaces: SpaceType[]): Promise<Generation> {
  const res = await api.post<One>('/generations', { textureId, prompt, spaces });
  return res.data.data.generation;
}

export async function getGenerations(): Promise<Generation[]> {
  const res = await api.get<ApiSuccess<{ generations: Generation[] }>>('/generations');
  return res.data.data.generations;
}

export async function getGeneration(id: string): Promise<Generation> {
  const res = await api.get<One>(`/generations/${id}`);
  return res.data.data.generation;
}

/** Creates again every picture of this visualization that failed (all at once). */
export async function retryFailedPictures(id: string): Promise<Generation> {
  const res = await api.post<One>(`/generations/${id}/retry`);
  return res.data.data.generation;
}

export async function deleteGeneration(id: string): Promise<void> {
  await api.delete(`/generations/${id}`);
}

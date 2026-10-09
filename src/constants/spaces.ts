import type { SpaceType } from '../types';

/** The scenes the AI can generate with the chosen surface (Step 2). */
export const SPACES: { value: SpaceType; label: string; description: string }[] = [
  { value: 'living_room_floor', label: 'Living Room Floor', description: 'Spacious lounge with the sample as flooring' },
  { value: 'bedroom_floor', label: 'Bedroom Floor', description: 'Calm bedroom with the sample on the floor' },
  { value: 'kitchen', label: 'Kitchen', description: 'Kitchen floor or countertop in the sample' },
  { value: 'bathroom', label: 'Bathroom', description: 'Bathroom floor and walls in the sample' },
  { value: 'staircase', label: 'Staircase', description: 'Stair treads and risers finished in the sample' },
  { value: 'feature_wall', label: 'Feature Wall', description: 'A statement wall clad in the sample' },
];

/** All six spaces — chosen by default in Step 2 (each becomes one image). */
export const ALL_SPACES: SpaceType[] = SPACES.map((s) => s.value);

export const SPACE_LABEL: Record<SpaceType, string> = Object.fromEntries(
  SPACES.map((s) => [s.value, s.label]),
) as Record<SpaceType, string>;

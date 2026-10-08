import type { SpaceType } from '../../types';

/** Simple line drawings for each scene (no image files needed). */
export function SpaceIllustration({ space }: { space: SpaceType }) {
  const common = {
    viewBox: '0 0 120 80',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  switch (space) {
    case 'living_room_floor':
      return (
        <svg {...common}>
          <path d="M6 62 L40 46 H80 L114 62" />
          <path d="M14 58 L46 50 M30 62 L52 50 M60 62 L60 50 M90 62 L68 50 M106 58 L74 50" opacity="0.45" />
          <rect x="40" y="30" width="40" height="12" rx="3" />
          <path d="M36 42 V34 a3 3 0 0 1 3 -3 M84 42 V34 a3 3 0 0 0 -3 -3 M36 42 H84" />
          <path d="M92 46 V22 M88 22 h8" />
        </svg>
      );
    case 'bedroom_floor':
      return (
        <svg {...common}>
          <path d="M6 62 L40 48 H80 L114 62" />
          <path d="M20 58 L48 49 M100 58 L72 49" opacity="0.45" />
          <rect x="36" y="32" width="48" height="12" rx="2" />
          <path d="M36 32 V24 H84 V32" />
          <rect x="40" y="27" width="14" height="5" rx="2" />
          <rect x="66" y="27" width="14" height="5" rx="2" />
        </svg>
      );
    case 'kitchen':
      return (
        <svg {...common}>
          <path d="M10 64 H110" />
          <rect x="14" y="40" width="92" height="24" />
          <path d="M10 40 H110" strokeWidth="3" />
          <path d="M37 40 V64 M60 40 V64 M83 40 V64" opacity="0.5" />
          <rect x="18" y="12" width="36" height="16" />
          <rect x="66" y="12" width="36" height="16" />
          <path d="M70 40 V32 a4 4 0 0 1 8 0" />
        </svg>
      );
    case 'bathroom':
      return (
        <svg {...common}>
          <path d="M10 64 H110" />
          <path d="M16 44 H74 V52 a10 10 0 0 1 -10 10 H26 a10 10 0 0 1 -10 -10 Z" />
          <path d="M22 44 V24 a6 6 0 0 1 12 0" />
          <rect x="86" y="14" width="18" height="24" rx="2" />
          <path d="M84 46 H106 M95 46 V64" />
          <path d="M10 14 V64 M10 30 H74 M10 14 H74" opacity="0.35" />
        </svg>
      );
    case 'staircase':
      return (
        <svg {...common}>
          <path d="M14 68 H34 V56 H50 V44 H66 V32 H82 V20 H106" />
          <path d="M14 68 H106 V20" opacity="0.35" />
          <path d="M34 56 L22 68 M50 44 L38 56 M66 32 L54 44 M82 20 L70 32" opacity="0.35" />
          <path d="M28 52 L100 8" />
          <path d="M40 45 V56 M56 35 V44 M72 25 V32 M88 15 V20" opacity="0.6" />
        </svg>
      );
    case 'feature_wall':
      return (
        <svg {...common}>
          <rect x="22" y="8" width="76" height="52" />
          <path d="M22 8 L42 60 M48 8 L66 60 M74 8 L94 60" opacity="0.4" />
          <path d="M8 68 L22 60 H98 L112 68" />
          <rect x="44" y="50" width="32" height="10" rx="2" />
        </svg>
      );
  }
}

import { useId, type ReactNode } from 'react';
import styles from './MarblePanel.module.css';

interface MarblePanelProps {
  children?: ReactNode;
  className?: string;
}

// Vein lines as [start x, thickness, opacity]; they are bent into natural shapes by the SVG filter below.
const VEINS: [number, number, number][] = [
  [-219, 2.4, 0.48],
  [-91, 0.8, 0.79],
  [122, 1.6, 0.35],
  [180, 0.6, 0.26],
  [626, 1.2, 0.29],
  [473, 0.8, 0.76],
  [363, 1.2, 0.80],
  [413, 1.2, 0.59],
  [-363, 1, 0.55],
  [363, 2.4, 0.77],
  [5, 0.8, 0.66],
  [-303, 0.6, 0.50],
  [207, 1, 0.47],
  [-234, 2.4, 0.27],

];

/**
 * A dark panel with generated black-and-gold marble veining (pure SVG, no image files).
 * Used for the sign-in side panel and the home hero card.
 */
export function MarblePanel({ children, className }: MarblePanelProps) {
  const filterId = `marble-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <div className={`${styles.panel} ${className ?? ''}`}>
      <svg className={styles.texture} viewBox="0 0 440 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.008" numOctaves="4" seed="21" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="220" xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation="0.35" />
        </filter>
        <g filter={`url(#${filterId})`} stroke="#d9c7a6" fill="none">
          {VEINS.map(([x, width, opacity], i) => (
            <line key={i} x1={x} y1={-100} x2={x - 520} y2={700} strokeWidth={width} strokeOpacity={opacity} />
          ))}
        </g>
      </svg>
      <div className={styles.content}>{children}</div>
    </div>
  );
}

import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { IoArrowBack } from 'react-icons/io5';
import { StepIndicator } from '../ui/StepIndicator';
import styles from './CreateStepLayout.module.css';

interface CreateStepLayoutProps {
  step: number;
  title: string;
  subtitle: string;
  backTo: string;
  children: ReactNode;
  footer: ReactNode;
  /** Wider page for grids (e.g. the texture library). */
  wide?: boolean;
}

export function CreateStepLayout({ step, title, subtitle, backTo, children, footer, wide = false }: CreateStepLayoutProps) {
  return (
    <div className={`${styles.wrap} ${wide ? styles.wide : ''}`}>
      <Link to={backTo} className={styles.back}>
        <IoArrowBack aria-hidden="true" /> Back
      </Link>
      <div className="fade-in">
        <StepIndicator current={step} total={3} />
        <h1 className={`title ${styles.title}`}>{title}</h1>
        <p className="body muted">{subtitle}</p>
      </div>
      <div className={`${styles.body} fade-in`} style={{ animationDelay: '120ms' }}>
        {children}
      </div>
      <div className={`${styles.footer} ${wide ? styles.stickyFooter : ''}`}>{footer}</div>
    </div>
  );
}

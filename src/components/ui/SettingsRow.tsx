import type { ReactNode } from 'react';
import type { IconType } from 'react-icons';
import { IoChevronForward } from 'react-icons/io5';
import styles from './SettingsRow.module.css';

interface SettingsRowProps {
  icon: IconType;
  label: string;
  hint?: string;
  onClick?: () => void;
  right?: ReactNode;
  destructive?: boolean;
}

export function SettingsRow({ icon: Icon, label, hint, onClick, right, destructive }: SettingsRowProps) {
  const content = (
    <>
      <Icon size={20} className={styles.icon} aria-hidden="true" />
      <span className={styles.label}>
        {label}
        {hint ? <span className={`caption muted ${styles.hint}`}>{hint}</span> : null}
      </span>
      {right ?? (onClick && !destructive ? <IoChevronForward className={styles.chevron} aria-hidden="true" /> : null)}
    </>
  );

  const className = `${styles.row} ${destructive ? styles.destructive : ''}`;
  return onClick ? (
    <button type="button" className={`${className} ${styles.clickable}`} onClick={onClick}>
      {content}
    </button>
  ) : (
    <div className={className}>{content}</div>
  );
}

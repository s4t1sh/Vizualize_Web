import type { IconType } from 'react-icons';
import { ButtonLink } from '../buttons/Button';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  icon: IconType;
  title: string;
  message: string;
  actionLabel?: string;
  actionTo?: string;
}

export function EmptyState({ icon: Icon, title, message, actionLabel, actionTo }: EmptyStateProps) {
  return (
    <div className={styles.container}>
      <div className={styles.ring}>
        <Icon size={26} aria-hidden="true" />
      </div>
      <h2 className="heading">{title}</h2>
      <p className={`body muted ${styles.message}`}>{message}</p>
      {actionLabel && actionTo ? (
        <ButtonLink to={actionTo} className={styles.action}>
          {actionLabel}
        </ButtonLink>
      ) : null}
    </div>
  );
}

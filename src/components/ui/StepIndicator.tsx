import styles from './StepIndicator.module.css';

export function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div aria-label={`Step ${current} of ${total}`}>
      <p className="overline muted">
        Step {current} of {total}
      </p>
      <div className={styles.bars} aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`${styles.bar} ${i < current ? styles.active : ''}`} />
        ))}
      </div>
    </div>
  );
}

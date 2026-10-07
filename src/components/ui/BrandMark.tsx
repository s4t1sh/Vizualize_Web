import styles from './BrandMark.module.css';

export function BrandMark({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className={`${styles.mark} ${inverse ? styles.inverse : ''}`}>
      <span className={styles.word}>Vizualizer</span>
      <span className={styles.rule} aria-hidden="true" />
    </span>
  );
}

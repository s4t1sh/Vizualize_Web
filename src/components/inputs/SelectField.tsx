import { useId, type SelectHTMLAttributes } from 'react';
import { IoChevronDown } from 'react-icons/io5';
import styles from './TextField.module.css';

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function SelectField({ label, error, options, id, ...rest }: SelectFieldProps) {
  const autoId = useId();
  const selectId = id ?? autoId;
  const errorId = `${selectId}-error`;
  return (
    <div className={styles.field}>
      <label htmlFor={selectId} className="overline muted">
        {label}
      </label>
      <div className={`${styles.row} ${error ? styles.hasError : ''}`}>
        <select
          id={selectId}
          className={`${styles.input} ${styles.select}`}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? errorId : undefined}
          {...rest}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <IoChevronDown aria-hidden="true" className={styles.selectIcon} />
      </div>
      {error ? (
        <p id={errorId} className={`caption error-text ${styles.error}`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

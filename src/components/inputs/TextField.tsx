import { useId, useState, type InputHTMLAttributes } from 'react';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import styles from './TextField.module.css';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
  type?: 'text' | 'email' | 'password';
}

export function TextField({ label, error, type = 'text', id, ...rest }: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className={styles.field}>
      <label htmlFor={inputId} className="overline muted">
        {label}
      </label>
      <div className={`${styles.row} ${error ? styles.hasError : ''}`}>
        <input
          id={inputId}
          type={isPassword && revealed ? 'text' : type}
          className={styles.input}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? errorId : undefined}
          {...rest}
        />
        {isPassword ? (
          <button
            type="button"
            className={styles.reveal}
            onClick={() => setRevealed((r) => !r)}
            aria-label={revealed ? 'Hide password' : 'Show password'}
          >
            {revealed ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
          </button>
        ) : null}
      </div>
      {error ? (
        <p id={errorId} className={`caption error-text ${styles.error}`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

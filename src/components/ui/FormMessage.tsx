import { IoAlertCircleOutline } from 'react-icons/io5';
import styles from './FormMessage.module.css';

/** A clear error message shown above a form button (e.g. "Incorrect email or password."). */
export function FormMessage({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className={styles.box} role="alert">
      <IoAlertCircleOutline size={18} aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}

import { useEffect, useId, useRef, type ReactNode } from 'react';
import { IoClose } from 'react-icons/io5';
import styles from './Modal.module.css';

// Counts open pop-ups so the page behind stays still even when one pop-up opens another.
let openCount = 0;
function lockPage() {
  openCount += 1;
  document.documentElement.style.overflow = 'hidden';
}
function unlockPage() {
  openCount = Math.max(0, openCount - 1);
  if (openCount === 0) document.documentElement.style.overflow = '';
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  /** Buttons shown in a bar at the bottom of the window. */
  footer?: ReactNode;
  size?: 'medium' | 'large';
}

/**
 * Accessible pop-up window (built on the browser's <dialog>): traps keyboard focus,
 * closes with Esc, the × button or a click on the dark background.
 * On phones it opens as a full-height sheet.
 */
export function Modal({ open, onClose, title, subtitle, children, footer, size = 'medium' }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!open) {
      if (dialog.open) dialog.close();
      return;
    }
    if (!dialog.open) dialog.showModal();
    lockPage();
    return () => {
      unlockPage();
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={`${styles.dialog} ${size === 'large' ? styles.large : ''}`}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        // A click on the dark background (outside the window) closes it.
        if (event.target === ref.current) onClose();
      }}
    >
      {open ? (
        <div className={styles.panel}>
          <header className={styles.header}>
            <div>
              <h2 id={titleId} className="heading">
                {title}
              </h2>
              {subtitle ? <p className="caption muted">{subtitle}</p> : null}
            </div>
            <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
              <IoClose size={22} />
            </button>
          </header>
          <div className={styles.body}>{children}</div>
          {footer ? <footer className={styles.footer}>{footer}</footer> : null}
        </div>
      ) : null}
    </dialog>
  );
}

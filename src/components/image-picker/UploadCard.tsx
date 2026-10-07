import { useRef, useState, type DragEvent } from 'react';
import { IoAdd, IoSwapHorizontal, IoTrashOutline } from 'react-icons/io5';
import { Button } from '../buttons/Button';
import { ACCEPTED_IMAGE_TYPES } from '../../utils/imageProcessing';
import styles from './UploadCard.module.css';

interface UploadCardProps {
  title: string;
  hint: string;
  imageUrl: string | null;
  busy?: boolean;
  error?: string | null;
  onFile: (file: File) => void;
  onRemove: () => void;
}

/**
 * Large upload area: click to choose a file (on phones this also offers the camera)
 * or drag and drop an image onto it. Shows the preview with Replace / Remove.
 */
export function UploadCard({ title, hint, imageUrl, busy = false, error, onFile, onRemove }: UploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const openPicker = () => inputRef.current?.click();

  const onDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file && !busy) onFile(file);
  };

  const dragProps = {
    onDragOver: (event: DragEvent<HTMLElement>) => {
      event.preventDefault();
      if (!busy) setDragging(true);
    },
    onDragLeave: () => setDragging(false),
    onDrop,
  };

  const input = (
    <input
      ref={inputRef}
      type="file"
      accept={ACCEPTED_IMAGE_TYPES}
      className="visually-hidden"
      tabIndex={-1}
      aria-hidden="true"
      onChange={(event) => {
        const file = event.target.files?.[0];
        if (file) onFile(file);
        event.target.value = '';
      }}
    />
  );

  return (
    <div>
      {input}
      {imageUrl ? (
        <>
          <div className={`${styles.frame} ${dragging ? styles.dragging : ''}`} {...dragProps}>
            <img src={imageUrl} alt={`Selected image for ${title}`} className={`${styles.preview} fade-in`} />
            {busy ? (
              <div className={styles.overlay}>
                <span className="spinner" aria-label="Preparing image" />
              </div>
            ) : null}
          </div>
          <div className={styles.actions}>
            <Button variant="secondary" icon={IoSwapHorizontal} onClick={openPicker} disabled={busy} fullWidth>
              Replace Image
            </Button>
            <Button variant="ghost" icon={IoTrashOutline} onClick={onRemove} disabled={busy}>
              Remove
            </Button>
          </div>
        </>
      ) : (
        <button
          type="button"
          className={`${styles.frame} ${styles.empty} ${dragging ? styles.dragging : ''}`}
          onClick={openPicker}
          disabled={busy}
          aria-busy={busy || undefined}
          {...dragProps}
        >
          <span className={styles.ring}>{busy ? <span className="spinner" /> : <IoAdd size={26} />}</span>
          <span className={styles.title}>{busy ? 'Preparing image…' : title}</span>
          <span className="caption muted">{hint}</span>
          <span className={`caption muted ${styles.dropHint}`}>Click to choose, or drag a photo here</span>
        </button>
      )}
      {error ? (
        <p className={`caption error-text ${styles.error}`} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

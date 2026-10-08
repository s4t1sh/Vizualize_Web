import { useState } from 'react';
import { IoCreateOutline, IoTrashOutline } from 'react-icons/io5';
import { Button } from '../buttons/Button';
import type { Texture } from '../../types';
import styles from './SampleActions.module.css';

interface SampleActionsProps {
  texture: Texture;
  busy: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

/** Edit / Delete buttons shown under each sample card in the sample list. */
export function SampleActions({ texture, busy, onEdit, onDelete }: SampleActionsProps) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className={styles.confirm} role="group" aria-label={`Delete ${texture.name}?`}>
        <p className="caption">Delete this sample permanently?</p>
        <div className={`${styles.actions} ${styles.two}`}>
          <Button variant="secondary" onClick={() => setConfirming(false)} disabled={busy}>
            Cancel
          </Button>
          <Button className={styles.danger} onClick={onDelete} loading={busy}>
            Delete
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.actions}>
      <Button
        variant="secondary"
        icon={IoCreateOutline}
        onClick={onEdit}
        disabled={busy}
        aria-label={`Edit ${texture.name}`}
      >
        Edit
      </Button>
      <Button
        variant="ghost"
        icon={IoTrashOutline}
        onClick={() => setConfirming(true)}
        disabled={busy}
        aria-label={`Delete ${texture.name}`}
        className={styles.delete}
      >
        <span className="visually-hidden">Delete</span>
      </Button>
    </div>
  );
}

import { useMemo, useState } from 'react';
import { IoGridOutline } from 'react-icons/io5';
import { Modal } from '../ui/Modal';
import { Button } from '../buttons/Button';
import { EmptyState } from '../ui/EmptyState';
import { FormMessage } from '../ui/FormMessage';
import { CategoryTabs, type CategoryFilter } from './CategoryTabs';
import { TextureCard } from './TextureCard';
import { SampleActions } from './SampleActions';
import { UploadSurfaceDialog } from './UploadSurfaceDialog';
import { useTextures } from '../../hooks/useTextures';
import { deleteTexture, getTextures } from '../../services/textureService';
import { ApiError } from '../../services/api';
import type { Texture } from '../../types';
import grid from './TextureGrid.module.css';

interface SamplePickerDialogProps {
  open: boolean;
  onClose: () => void;
  /** The sample currently chosen (pre-selected when the list opens). */
  current: Texture | null;
  onChoose: (texture: Texture) => void;
  /** Tells the page when the chosen sample was edited or deleted. */
  onCurrentChanged?: (texture: Texture | null) => void;
}

/**
 * Pop-up list of the samples stored in the database.
 * Users choose one here — nothing is picked from the computer — and can also edit or delete samples.
 * The list is (re)loaded every time the pop-up opens, so new uploads appear immediately.
 */
export function SamplePickerDialog(props: SamplePickerDialogProps) {
  return props.open ? <PickerWindow {...props} /> : null;
}

function PickerWindow({ onClose, current, onChoose, onCurrentChanged }: SamplePickerDialogProps) {
  const { textures, setTextures, loading, error, refresh } = useTextures(getTextures);
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [pendingId, setPendingId] = useState<string | null>(current?.id ?? null);
  const [editing, setEditing] = useState<Texture | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Partial<Record<CategoryFilter, number>> = { all: textures.length };
    for (const t of textures) c[t.category] = (c[t.category] ?? 0) + 1;
    return c;
  }, [textures]);
  const visible = filter === 'all' ? textures : textures.filter((t) => t.category === filter);
  const chosen = textures.find((t) => t.id === pendingId);

  const replaceInList = (updated: Texture) => {
    setTextures((list) => list.map((t) => (t.id === updated.id ? updated : t)));
    if (current?.id === updated.id) onCurrentChanged?.(updated);
  };

  const run = async (id: string, action: () => Promise<void>) => {
    setBusyId(id);
    setActionError(null);
    try {
      await action();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setBusyId(null);
    }
  };

  const remove = (texture: Texture) =>
    run(texture.id, async () => {
      await deleteTexture(texture.id);
      setTextures((list) => list.filter((t) => t.id !== texture.id));
      if (pendingId === texture.id) setPendingId(null);
      if (current?.id === texture.id) onCurrentChanged?.(null);
    });

  let body;
  if (loading) {
    body = (
      <div className={grid.grid} aria-busy="true" aria-label="Loading samples">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className={grid.skeleton} />
        ))}
      </div>
    );
  } else if (error) {
    body = (
      <div className={grid.state} role="alert">
        <p className="body muted">{error}</p>
        <Button variant="secondary" onClick={() => void refresh()} style={{ marginTop: 16 }}>
          Try Again
        </Button>
      </div>
    );
  } else if (textures.length === 0) {
    body = (
      <EmptyState
        icon={IoGridOutline}
        title="No samples yet."
        message="Use the “Upload Surface” button at the top of the page to add your first marble or granite sample."
      />
    );
  } else {
    body = (
      <>
        <FormMessage message={actionError} />
        <CategoryTabs value={filter} onChange={setFilter} counts={counts} />
        {visible.length === 0 ? (
          <p className={`body muted ${grid.state}`}>No samples in this category yet.</p>
        ) : (
          <div className={grid.grid}>
            {visible.map((texture) => (
              <TextureCard
                key={texture.id}
                texture={texture}
                selected={pendingId === texture.id}
                onSelect={() => setPendingId(texture.id)}
                footer={
                  <SampleActions
                    texture={texture}
                    busy={busyId === texture.id}
                    onEdit={() => setEditing(texture)}
                    onDelete={() => void remove(texture)}
                  />
                }
              />
            ))}
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <Modal
        open
        onClose={onClose}
        title="Choose a Surface"
        subtitle={chosen ? `Selected: ${chosen.name}` : 'Tap a sample from the library'}
        size="large"
        footer={
          <>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={!chosen} onClick={() => chosen && onChoose(chosen)}>
              Use This Surface
            </Button>
          </>
        }
      >
        {body}
      </Modal>
      <UploadSurfaceDialog
        open={Boolean(editing)}
        texture={editing}
        onClose={() => setEditing(null)}
        onSaved={replaceInList}
      />
    </>
  );
}

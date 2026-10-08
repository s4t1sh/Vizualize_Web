import { useEffect, useId, useState, type FormEvent } from 'react';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { Modal } from '../ui/Modal';
import { Button } from '../buttons/Button';
import { UploadCard } from '../image-picker/UploadCard';
import { TextField } from '../inputs/TextField';
import { SelectField } from '../inputs/SelectField';
import { FormMessage } from '../ui/FormMessage';
import { useImagePreparation } from '../../hooks/useImagePreparation';
import { createTexture, updateTexture } from '../../services/textureService';
import { ApiError } from '../../services/api';
import { PRICE_UNITS, TEXTURE_CATEGORIES } from '../../constants/textures';
import { makeThumbnail } from '../../utils/imageProcessing';
import { formatPrice } from '../../utils/format';
import type { PriceUnit, SelectedImage, Texture, TextureCategory } from '../../types';
import styles from './UploadSurfaceDialog.module.css';

interface UploadSurfaceDialogProps {
  open: boolean;
  onClose: () => void;
  /** Pass a sample to edit it; leave empty to upload a new one. */
  texture?: Texture | null;
  /** Called after a sample was added or updated. */
  onSaved?: (texture: Texture) => void;
}

/**
 * Form to add a sample (photo, name, category, price) to the library — or edit one.
 * Available to every signed-in user.
 */
export function UploadSurfaceDialog(props: UploadSurfaceDialogProps) {
  return props.open ? <UploadWindow {...props} /> : null;
}

type Field = 'name' | 'category' | 'priceAmount' | 'image';

function UploadWindow({ onClose, texture, onSaved }: UploadSurfaceDialogProps) {
  const isEdit = Boolean(texture);
  const formId = useId();
  const [image, setImage] = useState<SelectedImage | null>(null);
  const [name, setName] = useState(texture?.name ?? '');
  const [category, setCategory] = useState<TextureCategory>(texture?.category ?? 'marble');
  const [priceAmount, setPriceAmount] = useState(
    texture?.priceAmount === null || texture?.priceAmount === undefined ? '' : String(texture.priceAmount),
  );
  const [priceUnit, setPriceUnit] = useState<PriceUnit>(texture?.priceUnit ?? 'sq_ft');
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<Texture | null>(null);

  const preparation = useImagePreparation((prepared) => {
    setImage((old) => {
      if (old) URL.revokeObjectURL(old.previewUrl);
      return prepared;
    });
    setErrors((e) => ({ ...e, image: undefined }));
  });

  // Free the preview memory when the window closes.
  useEffect(() => () => {
    if (image) URL.revokeObjectURL(image.previewUrl);
  }, [image]);

  const reset = () => {
    setImage(null);
    setName('');
    setPriceAmount('');
    setErrors({});
    setFormError(null);
    setSaved(null);
    setSaving(false);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (saving) return;
    setFormError(null);

    const found: Partial<Record<Field, string>> = {};
    if (!isEdit && !image) found.image = 'Choose a photo of the sample.';
    if (!name.trim()) found.name = 'Enter a name, e.g. Statuario Marble.';
    if (priceAmount && (!Number.isFinite(Number(priceAmount)) || Number(priceAmount) < 0)) {
      found.priceAmount = 'Enter a valid price.';
    }
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    try {
      const images = image ? { image: image.file, thumbnail: await makeThumbnail(image.file) } : undefined;
      const details = { name: name.trim(), category, priceAmount, priceUnit };
      if (texture) {
        const updated = await updateTexture(texture.id, details, images);
        onSaved?.(updated);
        onClose();
        return;
      }
      if (!images) return;
      const created = await createTexture({ ...details, size: '', finish: '' }, images);
      setSaved(created);
      onSaved?.(created);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.fields) setErrors(err.fields as Partial<Record<Field, string>>);
        setFormError(err.message);
      } else {
        setFormError('Something went wrong. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (saved) {
    const price = formatPrice(saved.priceAmount, saved.priceUnit);
    return (
      <Modal
        open
        onClose={onClose}
        title="Surface Added"
        footer={
          <>
            <Button variant="secondary" onClick={reset}>
              Upload Another
            </Button>
            <Button onClick={onClose}>Done</Button>
          </>
        }
      >
        <div className={styles.success} role="status">
          <img src={saved.thumbnailUrl} alt="" className={styles.successImage} />
          <IoCheckmarkCircle size={28} className={styles.successIcon} aria-hidden="true" />
          <p className="heading">{saved.name}</p>
          <p className="caption muted">
            Added to the library{price ? ` · ${price}` : ''}. It now appears when choosing a surface.
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={isEdit ? 'Edit Surface' : 'Upload Surface'}
      subtitle={isEdit ? 'Change the details or replace the photo' : 'Add a marble, granite or tile sample to the library'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form={formId} loading={saving} disabled={preparation.busy}>
            {isEdit ? 'Save Changes' : 'Save Sample'}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={handleSubmit} noValidate>
        <div className={styles.imageArea}>
          <UploadCard
            title="Upload Sample Photo"
            hint="A clear, straight-on photo of the sample"
            imageUrl={image?.previewUrl ?? texture?.imageUrl ?? null}
            busy={preparation.busy}
            error={preparation.error ?? errors.image}
            onFile={preparation.handleFile}
            onRemove={() => {
              preparation.clearError();
              setImage((old) => {
                if (old) URL.revokeObjectURL(old.previewUrl);
                return null;
              });
            }}
            // When editing, the current photo can be replaced but not removed.
            removeLabel={isEdit && !image ? '' : 'Remove'}
          />
        </div>
        <TextField
          label="Sample Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          placeholder="e.g. Statuario Marble"
          maxLength={120}
          disabled={saving}
        />
        <SelectField
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value as TextureCategory)}
          error={errors.category}
          options={TEXTURE_CATEGORIES}
          disabled={saving}
        />
        <div className={styles.priceRow}>
          <TextField
            label="Price (₹)"
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            value={priceAmount}
            onChange={(e) => setPriceAmount(e.target.value)}
            error={errors.priceAmount}
            placeholder="e.g. 420"
            disabled={saving}
          />
          <SelectField
            label="Per"
            value={priceUnit}
            onChange={(e) => setPriceUnit(e.target.value as PriceUnit)}
            options={PRICE_UNITS}
            disabled={saving}
          />
        </div>
        <FormMessage message={formError} />
      </form>
    </Modal>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { IoAdd, IoSwapHorizontal } from 'react-icons/io5';
import { CreateStepLayout } from '../../components/layout/CreateStepLayout';
import { SamplePickerDialog } from '../../components/textures/SamplePickerDialog';
import { Button } from '../../components/buttons/Button';
import { useGenerationStore } from '../../store/generationStore';
import { CATEGORY_LABEL } from '../../constants/textures';
import { formatPrice } from '../../utils/format';
import styles from './TextureLibraryPage.module.css';

/**
 * Step 1: "Add Surface" opens the list of samples stored in the database.
 * The chosen sample is shown here; it can be changed any time.
 */
export function TextureLibraryPage() {
  const navigate = useNavigate();
  const selected = useGenerationStore((state) => state.selectedTexture);
  const setSelected = useGenerationStore((state) => state.setSelectedTexture);
  const [pickerOpen, setPickerOpen] = useState(false);

  const details = selected ? [selected.size, selected.finish].filter(Boolean).join(' · ') : '';
  const price = selected ? formatPrice(selected.priceAmount, selected.priceUnit) : null;

  return (
    <CreateStepLayout
      step={1}
      title="Choose Your Surface"
      subtitle="Add a marble, granite or tile from our sample library."
      backTo="/create"
      footer={
        <Button fullWidth disabled={!selected} onClick={() => navigate('/create/space')}>
          Continue
        </Button>
      }
    >
      {selected ? (
        <div className={`${styles.chosen} fade-in`}>
          <button
            type="button"
            className={styles.chosenImageButton}
            onClick={() => setPickerOpen(true)}
            aria-label={`Selected surface: ${selected.name}. Click to change.`}
          >
            <img src={selected.imageUrl} alt="" className={styles.chosenImage} />
          </button>
          <div className={styles.chosenInfo}>
            <p className="overline accent">{CATEGORY_LABEL[selected.category]}</p>
            <h2 className={`heading ${styles.chosenName}`}>{selected.name}</h2>
            {details ? <p className="caption muted">{details}</p> : null}
            {price ? <p className={`caption ${styles.price}`}>{price}</p> : null}
            <Button
              variant="secondary"
              icon={IoSwapHorizontal}
              onClick={() => setPickerOpen(true)}
              className={styles.change}
            >
              Change Surface
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className={styles.addCard}
          onClick={() => setPickerOpen(true)}
          aria-haspopup="dialog"
        >
          <span className={styles.ring}>
            <IoAdd size={28} />
          </span>
          <span className={styles.addTitle}>Add Surface</span>
          <span className="caption muted">Choose from the marble &amp; granite sample library</span>
        </button>
      )}

      <SamplePickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        current={selected}
        onCurrentChanged={setSelected}
        onChoose={(texture) => {
          setSelected(texture);
          setPickerOpen(false);
        }}
      />
    </CreateStepLayout>
  );
}

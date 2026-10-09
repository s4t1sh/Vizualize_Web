import { Navigate, useNavigate } from 'react-router';
import { IoCheckmark } from 'react-icons/io5';
import { CreateStepLayout } from '../../components/layout/CreateStepLayout';
import { SpaceIllustration } from '../../components/textures/SpaceIllustration';
import { Button } from '../../components/buttons/Button';
import { useGenerationStore } from '../../store/generationStore';
import { SPACES } from '../../constants/spaces';
import styles from './SpaceSelectPage.module.css';

/**
 * Step 2: the spaces the AI will create with the chosen surface.
 * All six are ticked at the start; tap a card to untick or tick it again. Each ticked space = one image.
 */
export function SpaceSelectPage() {
  const navigate = useNavigate();
  const selectedTexture = useGenerationStore((state) => state.selectedTexture);
  const selectedSpaces = useGenerationStore((state) => state.selectedSpaces);
  const toggleSpace = useGenerationStore((state) => state.toggleSpace);
  const setAllSpaces = useGenerationStore((state) => state.setAllSpaces);

  // Step 1 must be completed first (e.g. if this page was opened directly).
  if (!selectedTexture) return <Navigate to="/create/surface" replace />;

  const count = selectedSpaces.length;
  const allChosen = count === SPACES.length;

  return (
    <CreateStepLayout
      step={2}
      title="Choose Your Spaces"
      subtitle={`Where should ${selectedTexture.name} be shown? All ${SPACES.length} spaces are chosen to start with — tap a space to remove it or add it back. Each chosen space becomes its own image.`}
      backTo="/create/surface"
      footer={
        <>
          <p className={`caption muted ${styles.count}`} aria-live="polite">
            {count === 0
              ? 'Choose at least one space.'
              : `${count} of ${SPACES.length} spaces chosen · ${count} image${count === 1 ? '' : 's'} will be generated`}
          </p>
          <Button fullWidth disabled={count === 0} onClick={() => navigate('/create/vision')}>
            Continue
          </Button>
        </>
      }
    >
      <div className={styles.toolbar}>
        <button type="button" className={styles.selectAll} onClick={() => setAllSpaces(!allChosen)}>
          {allChosen ? 'Clear all' : 'Select all'}
        </button>
      </div>
      <div className={styles.grid}>
        {SPACES.map((space) => {
          const selected = selectedSpaces.includes(space.value);
          return (
            <button
              key={space.value}
              type="button"
              className={`${styles.card} ${selected ? styles.selected : ''}`}
              onClick={() => toggleSpace(space.value)}
              aria-pressed={selected}
            >
              <span className={styles.art}>
                <SpaceIllustration space={space.value} />
              </span>
              {selected ? (
                <span className={styles.check} aria-hidden="true">
                  <IoCheckmark size={16} />
                </span>
              ) : null}
              <span className={styles.label}>{space.label}</span>
              <span className="caption muted">{space.description}</span>
            </button>
          );
        })}
      </div>
    </CreateStepLayout>
  );
}

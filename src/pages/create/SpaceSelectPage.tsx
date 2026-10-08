import { Navigate, useNavigate } from 'react-router';
import { IoCheckmark } from 'react-icons/io5';
import { CreateStepLayout } from '../../components/layout/CreateStepLayout';
import { SpaceIllustration } from '../../components/textures/SpaceIllustration';
import { Button } from '../../components/buttons/Button';
import { useGenerationStore } from '../../store/generationStore';
import { SPACES } from '../../constants/spaces';
import styles from './SpaceSelectPage.module.css';

/**
 * Step 2: shows the six spaces the AI will create with the chosen surface.
 * All six are always included (one image each) — the user just presses Continue.
 */
export function SpaceSelectPage() {
  const navigate = useNavigate();
  const selectedTexture = useGenerationStore((state) => state.selectedTexture);

  // Step 1 must be completed first (e.g. if this page was opened directly).
  if (!selectedTexture) return <Navigate to="/create/surface" replace />;

  return (
    <CreateStepLayout
      step={2}
      title="Your Spaces"
      subtitle={`${selectedTexture.name} will be shown in all ${SPACES.length} spaces below — each becomes its own image.`}
      backTo="/create/surface"
      footer={
        <>
          <p className={`caption muted ${styles.count}`}>
            All {SPACES.length} spaces included · {SPACES.length} images will be generated
          </p>
          <Button fullWidth onClick={() => navigate('/create/vision')}>
            Continue
          </Button>
        </>
      }
    >
      <ul className={styles.grid} aria-label="Spaces that will be generated">
        {SPACES.map((space) => (
          <li key={space.value} className={styles.card}>
            <span className={styles.art}>
              <SpaceIllustration space={space.value} />
            </span>
            <span className={styles.check} aria-hidden="true">
              <IoCheckmark size={16} />
            </span>
            <span className={styles.label}>{space.label}</span>
            <span className="caption muted">{space.description}</span>
          </li>
        ))}
      </ul>
    </CreateStepLayout>
  );
}

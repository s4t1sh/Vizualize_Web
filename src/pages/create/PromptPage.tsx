import { useState } from 'react';
import { Navigate } from 'react-router';
import { IoSparklesOutline } from 'react-icons/io5';
import { CreateStepLayout } from '../../components/layout/CreateStepLayout';
import { Button } from '../../components/buttons/Button';
import { useGenerationStore } from '../../store/generationStore';
import styles from './PromptPage.module.css';

const MAX_LENGTH = 500;

const suggestions = [
  'Apply to floor',
  'Apply to wall',
  'Apply to both floor and wall',
  'Keep furniture unchanged',
  'Make it luxury',
  'Make it realistic',
];

const PLACEHOLDER =
  'Apply this marble texture to the floor while keeping the existing furniture, lighting and room structure unchanged. Make the result realistic and premium.';

export function PromptPage() {
  const textureImage = useGenerationStore((state) => state.textureImage);
  const roomImage = useGenerationStore((state) => state.roomImage);
  const prompt = useGenerationStore((state) => state.prompt);
  const setPrompt = useGenerationStore((state) => state.setPrompt);
  const [notice, setNotice] = useState<string | null>(null);

  if (!textureImage) return <Navigate to="/create/surface" replace />;
  if (!roomImage) return <Navigate to="/create/space" replace />;

  const toggleSuggestion = (text: string) => {
    if (prompt.includes(text)) {
      setPrompt(
        prompt
          .replace(text, '')
          .replace(/\.\s*\./g, '.')
          .replace(/\s{2,}/g, ' ')
          .replace(/^[\s.]+/, '')
          .trim(),
      );
    } else {
      const base = prompt.trim();
      const joined = base ? `${base.replace(/\.$/, '')}. ${text}.` : `${text}.`;
      setPrompt(joined.slice(0, MAX_LENGTH));
    }
  };

  const canCreate = Boolean(prompt.trim());

  return (
    <CreateStepLayout
      step={3}
      title="Describe Your Vision"
      subtitle="How would you like the surface to look?"
      backTo="/create/space"
      footer={
        <>
          {notice ? (
            <p className={`caption muted ${styles.helper}`} role="status">
              {notice}
            </p>
          ) : !canCreate ? (
            <p className={`caption muted ${styles.helper}`}>Add a description to continue.</p>
          ) : null}
          <Button
            fullWidth
            icon={IoSparklesOutline}
            disabled={!canCreate}
            onClick={() =>
              // Phase 2–5 preview: the generation request is connected in Phase 6 (API) and Phase 7 (AI).
              setNotice('Creating the visualization will be connected once the server and AI steps are added.')
            }
          >
            Create Visualization
          </Button>
        </>
      }
    >
      <div className={styles.thumbs}>
        <figure>
          <img src={textureImage.previewUrl} alt="Chosen surface" />
          <figcaption className="caption muted">Surface</figcaption>
        </figure>
        <figure>
          <img src={roomImage.previewUrl} alt="Chosen room" />
          <figcaption className="caption muted">Space</figcaption>
        </figure>
      </div>

      <label htmlFor="vision" className="visually-hidden">
        Describe your vision
      </label>
      <div className={styles.inputCard}>
        <textarea
          id="vision"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={PLACEHOLDER}
          maxLength={MAX_LENGTH}
          rows={6}
          className={styles.textarea}
        />
        <p className={`caption muted ${styles.counter}`}>
          {prompt.length}/{MAX_LENGTH}
        </p>
      </div>

      <p className={`overline muted ${styles.suggestTitle}`}>Suggestions</p>
      <div className={styles.chips}>
        {suggestions.map((text) => {
          const selected = prompt.includes(text);
          return (
            <button
              key={text}
              type="button"
              aria-pressed={selected}
              className={`${styles.chip} ${selected ? styles.chipSelected : ''}`}
              onClick={() => toggleSuggestion(text)}
            >
              {text}
            </button>
          );
        })}
      </div>
    </CreateStepLayout>
  );
}

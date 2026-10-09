import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import { IoSparklesOutline } from 'react-icons/io5';
import { CreateStepLayout } from '../../components/layout/CreateStepLayout';
import { Button } from '../../components/buttons/Button';
import { useGenerationStore } from '../../store/generationStore';
import { SPACE_LABEL } from '../../constants/spaces';
import { createGeneration } from '../../services/generationService';
import { ApiError } from '../../services/api';
import styles from './PromptPage.module.css';

const MAX_LENGTH = 500;

const suggestions = [
  'Modern luxury villa',
  'Minimal Scandinavian style',
  'Classic Indian home',
  'Warm evening light',
  'Bright natural daylight',
  'Photorealistic',
];

const PLACEHOLDER =
  'Optional — e.g. A modern luxury villa with warm evening light, wooden furniture and large windows.';

/** Step 3: optional style description, then generate. */
export function PromptPage() {
  const selectedTexture = useGenerationStore((state) => state.selectedTexture);
  const selectedSpaces = useGenerationStore((state) => state.selectedSpaces);
  const prompt = useGenerationStore((state) => state.prompt);
  const setPrompt = useGenerationStore((state) => state.setPrompt);
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!selectedTexture) return <Navigate to="/create/surface" replace />;
  if (selectedSpaces.length === 0) return <Navigate to="/create/space" replace />;

  const toggleSuggestion = (text: string) => {
    if (prompt.includes(text)) {
      setPrompt(
        prompt
          .replace(text, '')
          .replace(/,\s*,/g, ',')
          .replace(/\s{2,}/g, ' ')
          .replace(/^[\s,]+|[\s,]+$/g, '')
          .trim(),
      );
    } else {
      const base = prompt.trim().replace(/[.,]$/, '');
      setPrompt((base ? `${base}, ${text}` : text).slice(0, MAX_LENGTH));
    }
  };

  const count = selectedSpaces.length;

  const create = async () => {
    setCreating(true);
    setError(null);
    try {
      const generation = await createGeneration(selectedTexture.id, prompt.trim(), selectedSpaces);
      navigate(`/visualizations/${generation.id}`);
      setPrompt('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
      setCreating(false);
    }
  };

  return (
    <CreateStepLayout
      step={3}
      title="Describe Your Vision"
      subtitle="Add a style if you like — or leave it empty and we will create elegant, realistic interiors."
      backTo="/create/space"
      footer={
        <>
          {error ? (
            <p className={`caption error-text ${styles.helper}`} role="alert">
              {error}
            </p>
          ) : null}
          <Button fullWidth icon={IoSparklesOutline} loading={creating} onClick={() => void create()}>
            {`Create ${count} Visualization${count === 1 ? '' : 's'}`}
          </Button>
        </>
      }
    >
      <div className={styles.summary}>
        <img src={selectedTexture.thumbnailUrl} alt="" className={styles.summaryImage} />
        <div className={styles.summaryText}>
          <p className="overline muted">Surface</p>
          <p className={styles.summaryName}>{selectedTexture.name}</p>
          <p className="overline muted" style={{ marginTop: 'var(--space-sm)' }}>
            Spaces
          </p>
          <div className={styles.spaceChips}>
            {selectedSpaces.map((s) => (
              <span key={s} className={styles.spaceChip}>
                {SPACE_LABEL[s]}
              </span>
            ))}
          </div>
          <Link to="/create/space" className={styles.edit}>
            Change spaces
          </Link>
        </div>
      </div>

      <label htmlFor="vision" className="visually-hidden">
        Describe your vision (optional)
      </label>
      <div className={styles.inputCard}>
        <textarea
          id="vision"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={PLACEHOLDER}
          maxLength={MAX_LENGTH}
          rows={5}
          className={styles.textarea}
        />
        <p className={`caption muted ${styles.counter}`}>
          {prompt.length}/{MAX_LENGTH}
        </p>
      </div>

      <p className={`overline muted ${styles.suggestTitle}`}>Style suggestions</p>
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

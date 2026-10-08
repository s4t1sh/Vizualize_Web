import { useCallback, useEffect, useState } from 'react';
import { IoImagesOutline } from 'react-icons/io5';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/buttons/Button';
import { GenerationCard } from '../../components/visualizations/GenerationCard';
import { getGenerations } from '../../services/generationService';
import { ApiError } from '../../services/api';
import type { Generation } from '../../types';
import list from '../../components/visualizations/GenerationList.module.css';

export function HistoryPage() {
  const [items, setItems] = useState<Generation[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  /** "Try Again" after an error. */
  const load = useCallback(async () => {
    setError(null);
    try {
      setItems(await getGenerations());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to load your visualizations.');
    }
  }, []);

  // First load (ignored if the page is closed before it finishes).
  useEffect(() => {
    let active = true;
    getGenerations()
      .then((list) => active && setItems(list))
      .catch((err: unknown) => active && setError(err instanceof ApiError ? err.message : 'Unable to load your visualizations.'));
    return () => {
      active = false;
    };
  }, []);

  let body;
  if (error) {
    body = (
      <div className={list.state} role="alert">
        <p className="body muted">{error}</p>
        <Button variant="secondary" onClick={() => void load()} style={{ marginTop: 16 }}>
          Try Again
        </Button>
      </div>
    );
  } else if (!items) {
    body = (
      <div className={list.grid} aria-busy="true" aria-label="Loading visualizations">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className={list.skeleton} />
        ))}
      </div>
    );
  } else if (items.length === 0) {
    body = (
      <EmptyState
        icon={IoImagesOutline}
        title="No visualizations yet."
        message="Bring your ideas to life by creating your first AI visualization."
        actionLabel="Create Visualization"
        actionTo="/create"
      />
    );
  } else {
    body = (
      <div className={list.grid}>
        {items.map((generation) => (
          <GenerationCard key={generation.id} generation={generation} />
        ))}
      </div>
    );
  }

  return (
    <>
      <header className="fade-in" style={{ marginBottom: 'var(--space-lg)' }}>
        <p className="overline accent">Archive</p>
        <h1 className="title" style={{ marginTop: 'var(--space-sm)' }}>
          All Visualizations
        </h1>
        <p className="body muted" style={{ marginTop: 'var(--space-xs)' }}>
          Everything created on Vizualizer, newest first.
        </p>
      </header>
      <div className="fade-in" style={{ animationDelay: '120ms' }}>
        {body}
      </div>
    </>
  );
}

import { useCallback, useEffect, useMemo, useState } from 'react';
import { IoClose, IoImagesOutline, IoSearch } from 'react-icons/io5';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/buttons/Button';
import { GenerationCard } from '../../components/visualizations/GenerationCard';
import { getGenerations } from '../../services/generationService';
import { ApiError } from '../../services/api';
import type { Generation } from '../../types';
import { CATEGORY_LABEL } from '../../constants/textures';
import styles from './HistoryPage.module.css';
import list from '../../components/visualizations/GenerationList.module.css';

export function HistoryPage() {
  const [items, setItems] = useState<Generation[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  // Search by sample name, type (Marble, Granite…) or style text — every word must match.
  const shown = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!items || words.length === 0) return items;
    return items.filter((g) => {
      const text = [g.textureName, g.textureCategory ? CATEGORY_LABEL[g.textureCategory] : '', g.prompt]
        .join(' ')
        .toLowerCase();
      return words.every((w) => text.includes(w));
    });
  }, [items, query]);

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
  } else if (shown && shown.length === 0) {
    body = (
      <div className={list.state} role="status">
        <p className="body muted">No visualizations match “{query.trim()}”.</p>
        <Button variant="secondary" onClick={() => setQuery('')} style={{ marginTop: 16 }}>
          Clear Search
        </Button>
      </div>
    );
  } else {
    body = (
      <div className={list.grid}>
        {(shown ?? []).map((generation) => (
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
      {items && items.length > 0 ? (
        <div className={`${styles.search} fade-in`} role="search">
          <IoSearch size={18} aria-hidden="true" className={styles.searchIcon} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by sample name, type or style…"
            aria-label="Search visualizations"
            className={styles.searchInput}
          />
          {query ? (
            <button type="button" className={styles.clear} onClick={() => setQuery('')} aria-label="Clear search">
              <IoClose size={18} aria-hidden="true" />
            </button>
          ) : null}
          {query.trim() && shown ? (
            <span className={`caption muted ${styles.count}`} aria-live="polite">
              {shown.length} found
            </span>
          ) : null}
        </div>
      ) : null}
      <div className="fade-in" style={{ animationDelay: '120ms' }}>
        {body}
      </div>
    </>
  );
}

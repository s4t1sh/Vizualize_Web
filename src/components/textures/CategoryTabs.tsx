import type { TextureCategory } from '../../types';
import { TEXTURE_CATEGORIES } from '../../constants/textures';
import styles from './CategoryTabs.module.css';

export type CategoryFilter = TextureCategory | 'all';

interface CategoryTabsProps {
  value: CategoryFilter;
  onChange: (value: CategoryFilter) => void;
  /** Number of samples per category, shown next to each label. */
  counts: Partial<Record<CategoryFilter, number>>;
}

export function CategoryTabs({ value, onChange, counts }: CategoryTabsProps) {
  const tabs: { value: CategoryFilter; label: string }[] = [{ value: 'all', label: 'All' }, ...TEXTURE_CATEGORIES];
  return (
    <div className={styles.tabs} role="tablist" aria-label="Filter by category">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={value === tab.value}
          className={`${styles.tab} ${value === tab.value ? styles.active : ''}`}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
          <span className={styles.count}>{counts[tab.value] ?? 0}</span>
        </button>
      ))}
    </div>
  );
}

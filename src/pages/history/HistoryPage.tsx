import { IoImagesOutline } from 'react-icons/io5';
import { EmptyState } from '../../components/ui/EmptyState';

export function HistoryPage() {
  return (
    <>
      <header className="fade-in" style={{ marginBottom: 'var(--space-lg)' }}>
        <p className="overline accent">Archive</p>
        <h1 className="title" style={{ marginTop: 'var(--space-sm)' }}>
          My Visualizations
        </h1>
      </header>
      <div className="fade-in" style={{ animationDelay: '120ms' }}>
        <EmptyState
          icon={IoImagesOutline}
          title="No visualizations yet."
          message="Bring your ideas to life by creating your first AI visualization."
          actionLabel="Create Visualization"
          actionTo="/create"
        />
      </div>
    </>
  );
}

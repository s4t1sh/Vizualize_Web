import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { IoArrowForward } from 'react-icons/io5';
import { MarblePanel } from '../../components/ui/MarblePanel';
import { ButtonLink } from '../../components/buttons/Button';
import { useAuthStore } from '../../store/authStore';
import { getFirstName, getGreeting } from '../../utils/format';
import { GenerationCard } from '../../components/visualizations/GenerationCard';
import { getGenerations } from '../../services/generationService';
import type { Generation } from '../../types';
import list from '../../components/visualizations/GenerationList.module.css';
import styles from './HomePage.module.css';

export function HomePage() {
  const user = useAuthStore((state) => state.user);
  const [recent, setRecent] = useState<Generation[]>([]);

  // The three newest visualizations (if this fails, the friendly empty message stays).
  useEffect(() => {
    let active = true;
    getGenerations()
      .then((items) => active && setRecent(items.slice(0, 3)))
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <header className={`${styles.header} fade-in`}>
        <div>
          <p className="overline accent">Design Studio</p>
          <h1 className={`title ${styles.greeting}`}>
            {getGreeting()}, {getFirstName(user?.name ?? '')}
          </h1>
        </div>
      </header>

      <div className="fade-in" style={{ animationDelay: '120ms' }}>
        <MarblePanel className={styles.hero}>
          <div className={styles.heroInner}>
            <p className="overline accent">AI Visualization</p>
            <h2 className={`display ${styles.heroTitle}`}>Transform Your Space</h2>
            <p className={styles.heroBody}>Visualize your tiles and marble before making the final decision.</p>
            <ButtonLink to="/create" variant="accent" icon={IoArrowForward}>
              Start Designing
            </ButtonLink>
          </div>
        </MarblePanel>
      </div>

      <section className={`${styles.section} fade-in`} style={{ animationDelay: '220ms' }}>
        <div className={styles.sectionHead}>
          <h2 className="heading">Recent Visualizations</h2>
          {recent.length > 0 ? (
            <Link to="/history" className={styles.seeAll}>
              See all
            </Link>
          ) : null}
        </div>
        {recent.length > 0 ? (
          <div className={`${list.grid} ${styles.recentGrid}`}>
            {recent.map((generation) => (
              <GenerationCard key={generation.id} generation={generation} />
            ))}
          </div>
        ) : (
          <div className={styles.recentEmpty}>
            <p className="body muted">Your visualizations will appear here once you create your first design.</p>
          </div>
        )}
      </section>
    </>
  );
}

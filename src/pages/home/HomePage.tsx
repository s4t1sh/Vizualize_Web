import { IoArrowForward } from 'react-icons/io5';
import { MarblePanel } from '../../components/ui/MarblePanel';
import { ButtonLink } from '../../components/buttons/Button';
import { useAuthStore } from '../../store/authStore';
import { getFirstName, getGreeting } from '../../utils/format';
import styles from './HomePage.module.css';

export function HomePage() {
  const user = useAuthStore((state) => state.user);

  return (
    <>
      <header className={`${styles.header} fade-in`}>
        <p className="overline accent">Design Studio</p>
        <h1 className={`title ${styles.greeting}`}>
          {getGreeting()}, {getFirstName(user?.name ?? '')}
        </h1>
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
        <h2 className="heading">Recent Visualizations</h2>
        <div className={styles.recentEmpty}>
          <p className="body muted">Your visualizations will appear here once you create your first design.</p>
        </div>
      </section>
    </>
  );
}

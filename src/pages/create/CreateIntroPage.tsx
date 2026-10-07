import { IoArrowForward } from 'react-icons/io5';
import { ButtonLink } from '../../components/buttons/Button';
import styles from './CreateIntroPage.module.css';

const steps = [
  { title: 'Choose Your Surface', body: 'Upload the tile, marble or texture you want to visualize.' },
  { title: 'Choose Your Space', body: 'Upload a photo of the room, wall or floor you want to transform.' },
  { title: 'Describe Your Vision', body: 'Tell us how the surface should be applied.' },
];

export function CreateIntroPage() {
  return (
    <div className={styles.wrap}>
      <header className="fade-in">
        <p className="overline accent">New Visualization</p>
        <h1 className={`title ${styles.title}`}>Three steps to your new space</h1>
      </header>

      <ol className={styles.list}>
        {steps.map((step, index) => (
          <li key={step.title} className={`${styles.step} fade-in`} style={{ animationDelay: `${100 + index * 80}ms` }}>
            <span className={`heading accent ${styles.number}`}>{String(index + 1).padStart(2, '0')}</span>
            <span>
              <span className={styles.stepTitle}>{step.title}</span>
              <span className="caption muted">{step.body}</span>
            </span>
          </li>
        ))}
      </ol>

      <ButtonLink to="/create/surface" icon={IoArrowForward} fullWidth>
        Begin
      </ButtonLink>
    </div>
  );
}

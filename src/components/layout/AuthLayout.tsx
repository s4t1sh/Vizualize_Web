import { Outlet } from 'react-router';
import { MarblePanel } from '../ui/MarblePanel';
import { BrandMark } from '../ui/BrandMark';
import styles from './AuthLayout.module.css';

/** Split layout for Login / Register: marble panel on the left, form on the right. */
export function AuthLayout() {
  return (
    <div className={styles.page}>
      <MarblePanel className={styles.aside}>
        <div className={styles.asideInner}>
          <BrandMark inverse />
          <div>
            <p className={`overline ${styles.asideOverline}`}>AI Surface Visualization</p>
            <h2 className={`display ${styles.asideTitle}`}>See the surface before you choose it.</h2>
            <p className={styles.asideBody}>
              Upload a tile or marble, upload your room, and preview the result in your own space.
            </p>
          </div>
        </div>
      </MarblePanel>
      <main className={styles.main}>
        <div className={styles.formWrap}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

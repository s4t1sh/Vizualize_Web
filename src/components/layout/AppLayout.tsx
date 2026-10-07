import { NavLink, Outlet } from 'react-router';
import type { IconType } from 'react-icons';
import {
  IoAddCircle,
  IoAddCircleOutline,
  IoHome,
  IoHomeOutline,
  IoImages,
  IoImagesOutline,
  IoPerson,
  IoPersonOutline,
} from 'react-icons/io5';
import { BrandMark } from '../ui/BrandMark';
import styles from './AppLayout.module.css';

const navItems: { to: string; label: string; icon: [IconType, IconType]; end?: boolean }[] = [
  { to: '/', label: 'Home', icon: [IoHome, IoHomeOutline], end: true },
  { to: '/create', label: 'Create', icon: [IoAddCircle, IoAddCircleOutline] },
  { to: '/history', label: 'History', icon: [IoImages, IoImagesOutline] },
  { to: '/profile', label: 'Profile', icon: [IoPerson, IoPersonOutline] },
];

/** Signed-in layout: top navigation on wide screens, bottom tab bar on phones. */
export function AppLayout() {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <NavLink to="/" aria-label="Vizualizer home" className={styles.brandLink}>
            <BrandMark />
          </NavLink>
          <nav aria-label="Main" className={styles.topNav}>
            {navItems.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => `${styles.topLink} ${isActive ? styles.topActive : ''}`}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <nav aria-label="Main" className={styles.tabBar}>
        {navItems.map(({ to, label, icon: [Active, Inactive], end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `${styles.tab} ${isActive ? styles.tabActive : ''}`}
          >
            {({ isActive }) => (
              <>
                {isActive ? <Active size={22} aria-hidden="true" /> : <Inactive size={22} aria-hidden="true" />}
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

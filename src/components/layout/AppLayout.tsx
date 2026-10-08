import { useState } from 'react';
import { NavLink, Outlet } from 'react-router';
import type { IconType } from 'react-icons';
import {
  IoAddCircle,
  IoAddCircleOutline,
  IoCloudUploadOutline,
  IoHome,
  IoHomeOutline,
  IoImages,
  IoImagesOutline,
  IoPerson,
  IoPersonOutline,
} from 'react-icons/io5';
import { BrandMark } from '../ui/BrandMark';
import { UploadSurfaceDialog } from '../textures/UploadSurfaceDialog';
import styles from './AppLayout.module.css';

type NavItem = { to: string; label: string; icon: [IconType, IconType]; end?: boolean };

const navItems: NavItem[] = [
  { to: '/', label: 'Home', icon: [IoHome, IoHomeOutline], end: true },
  { to: '/create', label: 'Create', icon: [IoAddCircle, IoAddCircleOutline] },
  { to: '/history', label: 'History', icon: [IoImages, IoImagesOutline] },
  { to: '/profile', label: 'Profile', icon: [IoPerson, IoPersonOutline] },
];

/** Signed-in layout: top navigation on wide screens, bottom tab bar on phones. */
export function AppLayout() {
  const [uploadOpen, setUploadOpen] = useState(false);
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <NavLink to="/" aria-label="Vizualizer home" className={styles.brandLink}>
            <BrandMark />
          </NavLink>
          <div className={styles.headerRight}>
            <button
              type="button"
              className={styles.uploadButton}
              onClick={() => setUploadOpen(true)}
              aria-haspopup="dialog"
            >
              <IoCloudUploadOutline size={18} aria-hidden="true" />
              <span className={styles.uploadLabel}>Upload Surface</span>
            </button>
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

      <UploadSurfaceDialog open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </div>
  );
}

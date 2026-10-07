import {
  IoLockClosedOutline,
  IoLogOutOutline,
  IoMoonOutline,
  IoNotificationsOutline,
  IoPersonOutline,
  IoShieldCheckmarkOutline,
} from 'react-icons/io5';
import { SettingsRow } from '../../components/ui/SettingsRow';
import { Switch } from '../../components/ui/Switch';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { formatMonthYear, getInitials } from '../../utils/format';
import styles from './ProfilePage.module.css';

export function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const mode = useThemeStore((state) => state.mode);
  const toggleMode = useThemeStore((state) => state.toggleMode);

  return (
    <div className={styles.wrap}>
      <header className="fade-in" style={{ marginBottom: 'var(--space-xl)' }}>
        <p className="overline accent">Account</p>
        <h1 className="title" style={{ marginTop: 'var(--space-sm)' }}>
          Profile
        </h1>
      </header>

      <div className={`${styles.identity} fade-in`} style={{ animationDelay: '100ms' }}>
        <div className={styles.avatar} aria-hidden="true">
          {getInitials(user?.name ?? '')}
        </div>
        <div>
          <h2 className="heading">{user?.name}</h2>
          <p className="body muted">{user?.email}</p>
          {user ? <p className="caption muted">Member since {formatMonthYear(user.createdAt)}</p> : null}
        </div>
      </div>

      <div className="fade-in" style={{ animationDelay: '180ms' }}>
        <div className={styles.group}>
          <SettingsRow icon={IoPersonOutline} label="Edit Profile" hint="Available soon" />
          <SettingsRow icon={IoLockClosedOutline} label="Change Password" hint="Available soon" />
          <SettingsRow
            icon={IoMoonOutline}
            label="Dark Mode"
            right={<Switch checked={mode === 'dark'} onChange={toggleMode} label="Dark mode" />}
          />
          <SettingsRow icon={IoNotificationsOutline} label="Notifications" hint="Available soon" />
          <SettingsRow icon={IoShieldCheckmarkOutline} label="Privacy" hint="Available soon" />
        </div>
        <div className={styles.group}>
          <SettingsRow icon={IoLogOutOutline} label="Logout" onClick={signOut} destructive />
        </div>
      </div>
    </div>
  );
}

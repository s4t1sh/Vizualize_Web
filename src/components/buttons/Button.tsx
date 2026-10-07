import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router';
import type { IconType } from 'react-icons';
import styles from './Button.module.css';

type Variant = 'primary' | 'accent' | 'secondary' | 'ghost';

interface CommonProps {
  variant?: Variant;
  icon?: IconType;
  fullWidth?: boolean;
  children: ReactNode;
}

function classes(variant: Variant, fullWidth: boolean, extra?: string) {
  return [styles.button, styles[variant], fullWidth ? styles.full : '', extra ?? ''].join(' ');
}

interface ButtonProps extends CommonProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  icon: Icon,
  fullWidth = false,
  loading = false,
  disabled,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={classes(variant, fullWidth, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <span className="spinner" aria-label="Loading" />
      ) : (
        <>
          {Icon ? <Icon size={18} aria-hidden="true" /> : null}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}

interface ButtonLinkProps extends CommonProps, Omit<LinkProps, 'children'> {}

/** A link that looks like a button (for navigation). */
export function ButtonLink({ variant = 'primary', icon: Icon, fullWidth = false, className, children, ...rest }: ButtonLinkProps) {
  return (
    <Link className={classes(variant, fullWidth, className)} {...rest}>
      {Icon ? <Icon size={18} aria-hidden="true" /> : null}
      <span>{children}</span>
    </Link>
  );
}

import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { BrandMark } from '../../components/ui/BrandMark';
import { FormMessage } from '../../components/ui/FormMessage';
import { TextField } from '../../components/inputs/TextField';
import { Button } from '../../components/buttons/Button';
import { useAuthStore } from '../../store/authStore';
import { login } from '../../services/authService';
import { ApiError } from '../../services/api';
import { fieldErrors, loginSchema } from '../../utils/validation';
import styles from './Auth.module.css';

type Field = 'email' | 'password';

export function LoginPage() {
  const completeSignIn = useAuthStore((state) => state.completeSignIn);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    setFormError(null);

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});

    setSubmitting(true);
    try {
      const { token, user } = await login(parsed.data);
      completeSignIn(token, user);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.fields) setErrors(error.fields);
        setFormError(error.message);
      } else {
        setFormError('Something went wrong. Please try again.');
      }
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className={`${styles.header} fade-in`}>
        <span className={styles.mobileBrand}>
          <BrandMark />
        </span>
        <h1 className={`display ${styles.title}`}>Welcome back</h1>
        <p className="body muted">Sign in to continue designing your spaces.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="fade-in" style={{ animationDelay: '120ms' }}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          placeholder="you@example.com"
          autoComplete="email"
          disabled={submitting}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          placeholder="Your password"
          autoComplete="current-password"
          disabled={submitting}
        />
        <FormMessage message={formError} />
        <Button type="submit" fullWidth loading={submitting}>
          Sign In
        </Button>
      </form>

      <p className={`body ${styles.footer}`}>
        New to Vizualizer? <Link to="/register">Create an account</Link>
      </p>
    </>
  );
}

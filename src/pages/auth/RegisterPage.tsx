import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { BrandMark } from '../../components/ui/BrandMark';
import { FormMessage } from '../../components/ui/FormMessage';
import { TextField } from '../../components/inputs/TextField';
import { Button } from '../../components/buttons/Button';
import { useAuthStore } from '../../store/authStore';
import { register } from '../../services/authService';
import { ApiError } from '../../services/api';
import { fieldErrors, registerSchema } from '../../utils/validation';
import styles from './Auth.module.css';

type Field = 'name' | 'email' | 'password' | 'confirmPassword';

export function RegisterPage() {
  const completeSignIn = useAuthStore((state) => state.completeSignIn);
  const [form, setForm] = useState<Record<Field, string>>({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const update = (field: Field) => (event: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [field]: event.target.value }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    setFormError(null);

    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});

    setSubmitting(true);
    try {
      const { token, user } = await register(parsed.data);
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
        <h1 className={`display ${styles.title}`}>Create your account</h1>
        <p className="body muted">Visualize tiles and marble in your own space.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="fade-in" style={{ animationDelay: '120ms' }}>
        <TextField
          label="Full Name"
          value={form.name}
          onChange={update('name')}
          error={errors.name}
          placeholder="Your name"
          autoComplete="name"
          disabled={submitting}
        />
        <TextField
          label="Email"
          type="email"
          value={form.email}
          onChange={update('email')}
          error={errors.email}
          placeholder="you@example.com"
          autoComplete="email"
          disabled={submitting}
        />
        <TextField
          label="Password"
          type="password"
          value={form.password}
          onChange={update('password')}
          error={errors.password}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          disabled={submitting}
        />
        <TextField
          label="Confirm Password"
          type="password"
          value={form.confirmPassword}
          onChange={update('confirmPassword')}
          error={errors.confirmPassword}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          disabled={submitting}
        />
        <FormMessage message={formError} />
        <Button type="submit" fullWidth loading={submitting}>
          Create Account
        </Button>
      </form>

      <p className={`body ${styles.footer}`}>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </>
  );
}

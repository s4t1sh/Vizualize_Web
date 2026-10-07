import { ButtonLink } from '../components/buttons/Button';

export function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }} className="fade-in">
      <p className="overline accent">404</p>
      <h1 className="title" style={{ margin: '12px 0 24px' }}>
        This page doesn’t exist.
      </h1>
      <ButtonLink to="/">Back to Home</ButtonLink>
    </div>
  );
}

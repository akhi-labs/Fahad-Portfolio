import Link from 'next/link';

export default function NotFound() {
  return (
    <main
      className="shell"
      style={{
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 24,
      }}
    >
      <p className="tiny muted">ERROR / 404</p>
      <h1 className="section-title">
        <span>PAGE NOT</span>
        <span>FOUND</span>
      </h1>
      <Link
        href="/"
        style={{
          fontSize: 9,
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          borderBottom: '1px solid var(--fg)',
          paddingBottom: 4,
          alignSelf: 'flex-start',
        }}
      >
        Back to home
      </Link>
    </main>
  );
}

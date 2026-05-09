import Link from 'next/link';
import NavBar from '@/components/NavBar';

export default function RecipesPage() {
  return (
    <>
      <NavBar />
      <main style={{ background: '#fafaf8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <div style={{ fontSize: 48, marginBottom: 24 }}>🍽️</div>
          <h1 style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.4px', marginBottom: 12 }}>Recipes coming soon</h1>
          <p style={{ fontSize: 16, color: '#6B7280', lineHeight: 1.65, marginBottom: 32 }}>
            The full recipe index is being built. In the meantime, head to the planner to build your meal plan and shopping list.
          </p>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', fontSize: 15, fontWeight: 600, color: '#fff', background: '#1a1a1a', padding: '13px 24px', borderRadius: 10, textDecoration: 'none' }}>
            Go to the Planner →
          </Link>
        </div>
      </main>
    </>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

type AuthUser = { email: string | undefined; avatarUrl: string | null };

function useAuthUser() {
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user
        ? { email: user.email, avatarUrl: user.user_metadata?.avatar_url ?? null }
        : null
      );
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u
        ? { email: u.email, avatarUrl: u.user_metadata?.avatar_url ?? null }
        : null
      );
    });

    return () => subscription.unsubscribe();
  }, []);

  return user;
}

function AuthButton({ user }: { user: AuthUser | null | undefined }) {
  if (user === undefined) return null;

  if (user) {
    return (
      <Link href="/profile" style={authBtnStyle}>
        {user.avatarUrl
          ? <img src={user.avatarUrl} alt="avatar" style={avatarStyle} />
          : <span style={avatarInitialStyle}>{(user.email ?? 'U')[0].toUpperCase()}</span>
        }
        My Account
      </Link>
    );
  }

  return (
    <Link href="/login" style={authBtnStyle}>
      Sign In
    </Link>
  );
}

const authBtnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 7,
  padding: '7px 14px',
  fontSize: 13,
  fontWeight: 600,
  fontFamily: "'DM Sans', sans-serif",
  color: '#1a1a1a',
  background: '#fff',
  border: '1.5px solid #E5E7EB',
  borderRadius: 8,
  textDecoration: 'none',
  whiteSpace: 'nowrap' as const,
  transition: 'border-color 0.15s',
};

const avatarStyle: React.CSSProperties = {
  width: 20,
  height: 20,
  borderRadius: '50%',
  objectFit: 'cover',
};

const avatarInitialStyle: React.CSSProperties = {
  width: 20,
  height: 20,
  borderRadius: '50%',
  background: '#22C55E',
  color: '#fff',
  fontSize: 11,
  fontWeight: 700,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

export default function NavBar() {
  const pathname = usePathname();
  const user = useAuthUser();

  return (
    <nav className="site-nav">
      <div className="site-nav-inner">
        <Link href="/" className="site-nav-logo">
          Joe&apos;s MealMap
        </Link>
        <div className="site-nav-links">
          <Link href="/" className={`site-nav-link${pathname === '/' ? ' active' : ''}`}>
            Home
          </Link>
          <Link href="/planner" className={`site-nav-link${pathname === '/planner' ? ' active' : ''}`}>
            Planner
          </Link>
          <Link href="/recipes" className={`site-nav-link${pathname?.startsWith('/recipes') ? ' active' : ''}`}>
            Recipes
          </Link>
          <Link href="/blog" className={`site-nav-link${pathname?.startsWith('/blog') ? ' active' : ''}`}>
            Blog
          </Link>
          <Link href="/about" className={`site-nav-link${pathname === '/about' ? ' active' : ''}`}>
            About
          </Link>
          <AuthButton user={user} />
          <Link href="/planner" className="site-nav-cta">
            Start Planning →
          </Link>
        </div>
        <MobileMenu pathname={pathname} user={user} />
      </div>
    </nav>
  );
}

function MobileMenu({ pathname, user }: { pathname: string | null; user: AuthUser | null | undefined }) {
  return (
    <div className="site-nav-mobile">
      <details className="mobile-menu">
        <summary className="mobile-menu-btn" aria-label="Menu">
          <span />
          <span />
          <span />
        </summary>
        <div className="mobile-menu-dropdown">
          <Link href="/" className={pathname === '/' ? 'active' : ''}>Home</Link>
          <Link href="/planner" className={pathname === '/planner' ? 'active' : ''}>Planner</Link>
          <Link href="/recipes" className={pathname?.startsWith('/recipes') ? 'active' : ''}>Recipes</Link>
          <Link href="/blog" className={pathname?.startsWith('/blog') ? 'active' : ''}>Blog</Link>
          <Link href="/about" className={pathname === '/about' ? 'active' : ''}>About</Link>
          {user ? (
            <Link href="/profile" className={pathname === '/profile' ? 'active' : ''}>My Account</Link>
          ) : (
            <Link href="/login" className={pathname === '/login' ? 'active' : ''}>Sign In</Link>
          )}
          <Link href="/planner" className="mobile-cta">Start Planning →</Link>
        </div>
      </details>
    </div>
  );
}

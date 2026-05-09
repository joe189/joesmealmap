'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="site-nav">
      <div className="site-nav-inner">
        <Link href="/home" className="site-nav-logo">
          Joe&apos;s MealMap
        </Link>
        <div className="site-nav-links">
          <Link href="/home" className={`site-nav-link${pathname === '/home' ? ' active' : ''}`}>
            Home
          </Link>
          <Link href="/recipes" className={`site-nav-link${pathname?.startsWith('/recipes') ? ' active' : ''}`}>
            Recipes
          </Link>
          <Link href="/" className={`site-nav-link${pathname === '/' ? ' active' : ''}`}>
            Planner
          </Link>
          <Link href="/about" className={`site-nav-link${pathname === '/about' ? ' active' : ''}`}>
            About
          </Link>
          <Link href="/" className="site-nav-cta">
            Start Planning →
          </Link>
        </div>
        <MobileMenu pathname={pathname} />
      </div>
    </nav>
  );
}

function MobileMenu({ pathname }: { pathname: string | null }) {
  return (
    <div className="site-nav-mobile">
      <details className="mobile-menu">
        <summary className="mobile-menu-btn" aria-label="Menu">
          <span />
          <span />
          <span />
        </summary>
        <div className="mobile-menu-dropdown">
          <Link href="/home" className={pathname === '/home' ? 'active' : ''}>Home</Link>
          <Link href="/recipes" className={pathname?.startsWith('/recipes') ? 'active' : ''}>Recipes</Link>
          <Link href="/" className={pathname === '/' ? 'active' : ''}>Planner</Link>
          <Link href="/about" className={pathname === '/about' ? 'active' : ''}>About</Link>
          <Link href="/" className="mobile-cta">Start Planning →</Link>
        </div>
      </details>
    </div>
  );
}

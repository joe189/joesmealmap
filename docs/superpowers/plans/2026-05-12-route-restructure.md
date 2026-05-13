# Route Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Swap `/` and `/home` so the marketing homepage lives at `/` and the planner lives at `/planner`, with a 301 redirect from `/home` to `/`.

**Architecture:** Move file content between routes (no logic changes), update every internal `href` to match the new structure, add a Next.js redirect for the old `/home` URL, and verify with a production build.

**Tech Stack:** Next.js 15 (App Router), TypeScript, React 19

---

## File Map

| Action | Path |
|--------|------|
| Create | `app/planner/page.tsx` |
| Overwrite | `app/page.tsx` |
| Delete | `app/home/page.tsx` |
| Modify | `next.config.ts` |
| Modify | `components/NavBar.tsx` |
| Modify | `app/recipes/[slug]/page.tsx` |
| Modify | `app/about/page.tsx` |

---

### Task 1: Create `app/planner/page.tsx`

The MealMap planner currently lives at `app/page.tsx`. It is a single line that re-exports `<MealMap />`. Create the new directory and file.

**Files:**
- Create: `app/planner/page.tsx`

- [ ] **Step 1: Create the file**

```tsx
import MealMap from '@/components/MealMap';

export default function PlannerPage() {
  return <MealMap />;
}
```

- [ ] **Step 2: Verify file exists**

Run: `ls /Users/josephjennings/Desktop/JoesMealMap/app/planner/page.tsx`
Expected: file path printed, no error

- [ ] **Step 3: Commit**

```bash
git add app/planner/page.tsx
git commit -m "feat: add app/planner/page.tsx — planner moves from / to /planner"
```

---

### Task 2: Replace `app/page.tsx` with the homepage content

`app/home/page.tsx` is the marketing homepage. It becomes the new `app/page.tsx`. The old `app/page.tsx` (the one-liner planner) is discarded. While writing the new content, update the two internal links that pointed to the old route structure:

- `href="/"` (Start Planning hero CTA, line 78) → `href="/planner"`
- Footer `<Link href="/home">Home</Link>` → `href="/"`
- Footer `<Link href="/">Planner</Link>` → `href="/planner"`

**Files:**
- Overwrite: `app/page.tsx`

- [ ] **Step 1: Write the new `app/page.tsx`**

```tsx
import Link from 'next/link';
import Image from 'next/image';
import NavBar from '@/components/NavBar';
import recipesRaw from '@/lib/recipes-merged.json';

type Recipe = {
  slug: string; name: string; type: string; proto: string;
  prepTime: number; cookTime: number; totalTime: number;
  cal: number; pro: number; carb: number; fat: number; cost: number;
  description: string; photoSearch: string;
};

const recipes = recipesRaw as Recipe[];

const FEATURED_SLUGS = [
  'grilled-chicken-rice-bowl',
  'baked-salmon-sweet-potato',
  'beef-taco-bowl',
  'greek-yogurt-berry-bowl',
  'chicken-tikka-masala',
  'chicken-caesar-salad',
];

const PROTO_COLORS: Record<string, { bg: string; text: string }> = {
  chicken:  { bg: '#FFF3E0', text: '#E65100' },
  beef:     { bg: '#FCE4EC', text: '#C62828' },
  fish:     { bg: '#E3F2FD', text: '#1565C0' },
  yogurt:   { bg: '#F3E5F5', text: '#6A1B9A' },
  eggs:     { bg: '#FFFDE7', text: '#F57F17' },
  pork:     { bg: '#FBE9E7', text: '#BF360C' },
  legumes:  { bg: '#E8F5E9', text: '#2E7D32' },
  tofu:     { bg: '#E0F2F1', text: '#00695C' },
};

const PROTO_EMOJI: Record<string, string> = {
  chicken: '🍗', beef: '🥩', fish: '🐟', yogurt: '🥛',
  eggs: '🥚', pork: '🐷', legumes: '🫘', tofu: '🌱',
};

const TYPE_LABEL: Record<string, string> = {
  breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack',
};

export default function HomePage() {
  const featured = FEATURED_SLUGS
    .map(slug => recipes.find(r => r.slug === slug))
    .filter(Boolean) as Recipe[];

  return (
    <>
      <NavBar />
      <main className="home-main">

        {/* Hero */}
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-photo-col">
              <div className="hero-photo-wrap">
                <Image
                  src="/joe.webp"
                  alt="Joe Jennings, founder of Joe's MealMap"
                  width={420}
                  height={520}
                  priority
                  className="hero-photo"
                />
              </div>
            </div>
            <div className="hero-text-col">
              <span className="hero-eyebrow">Meal planning, simplified</span>
              <h1 className="hero-headline">
                Eat right without<br />overthinking it.
              </h1>
              <p className="hero-sub">
                Set your macro targets, pick meals you actually want to eat, and get a complete shopping list sent to your inbox. Takes about 3 minutes.
              </p>
              <div className="hero-actions">
                <Link href="/planner" className="btn-primary">Start Planning →</Link>
                <Link href="/recipes" className="btn-secondary">Browse Recipes</Link>
              </div>
              <div className="hero-stats">
                <div className="hero-stat">
                  <span className="hero-stat-num">100+</span>
                  <span className="hero-stat-lbl">Recipes</span>
                </div>
                <div className="hero-stat-divider" />
                <div className="hero-stat">
                  <span className="hero-stat-num">6</span>
                  <span className="hero-stat-lbl">Diet goals</span>
                </div>
                <div className="hero-stat-divider" />
                <div className="hero-stat">
                  <span className="hero-stat-num">Free</span>
                  <span className="hero-stat-lbl">Forever</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="how-section">
          <div className="section-inner">
            <div className="section-header">
              <span className="section-eyebrow">How it works</span>
              <h2 className="section-title">From goals to grocery list in minutes</h2>
            </div>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-num">01</div>
                <div className="step-icon">🎯</div>
                <h3 className="step-title">Set your macros</h3>
                <p className="step-desc">
                  Enter your protein, carb, and fat targets — or use the built-in calculator to get a recommendation based on your bodyweight and goal.
                </p>
              </div>
              <div className="step-connector" />
              <div className="step-card">
                <div className="step-num">02</div>
                <div className="step-icon">🍽️</div>
                <h3 className="step-title">Pick your meals</h3>
                <p className="step-desc">
                  Choose your protein preferences and dietary needs. Pick 3 meals per category — breakfast, lunch, and dinner — that rotate across your week.
                </p>
              </div>
              <div className="step-connector" />
              <div className="step-card">
                <div className="step-num">03</div>
                <div className="step-icon">🛒</div>
                <h3 className="step-title">Shop the list</h3>
                <p className="step-desc">
                  Get a complete weekly shopping list with real US quantities, Walmart links, and budget tracking — delivered straight to your inbox.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Recipes */}
        <section className="recipes-section">
          <div className="section-inner">
            <div className="section-header">
              <span className="section-eyebrow">From the database</span>
              <h2 className="section-title">Meals worth eating every week</h2>
              <p className="section-sub">
                Every recipe is built around hitting your macros — not sacrificing flavor to do it.
              </p>
            </div>
            <div className="recipe-grid">
              {featured.map((recipe) => {
                const protoColor = PROTO_COLORS[recipe.proto] ?? { bg: '#F5F5F5', text: '#555' };
                return (
                  <Link key={recipe.slug} href={`/recipes/${recipe.slug}`} className="recipe-card">
                    <div className="recipe-card-img-wrap">
                      <div className="recipe-card-img-placeholder">
                        <span className="recipe-card-img-emoji">
                          {PROTO_EMOJI[recipe.proto] ?? '🍴'}
                        </span>
                      </div>
                      <div
                        className="recipe-card-proto-tag"
                        style={{ background: protoColor.bg, color: protoColor.text }}
                      >
                        {recipe.proto.charAt(0).toUpperCase() + recipe.proto.slice(1)}
                      </div>
                      <div className="recipe-card-type-tag">
                        {TYPE_LABEL[recipe.type] ?? recipe.type}
                      </div>
                    </div>
                    <div className="recipe-card-body">
                      <h3 className="recipe-card-name">{recipe.name}</h3>
                      <p className="recipe-card-desc">{recipe.description}</p>
                      <div className="recipe-card-macros">
                        <span className="rcm rcm-cal">{recipe.cal} cal</span>
                        <span className="rcm rcm-pro">{recipe.pro}g protein</span>
                        <span className="rcm rcm-time">⏱ {recipe.totalTime} min</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="recipes-cta-row">
              <Link href="/recipes" className="btn-secondary">View all recipes →</Link>
            </div>
          </div>
        </section>

        {/* Email Capture */}
        <section className="email-section">
          <div className="email-inner">
            <h2 className="email-headline">New recipes every week.</h2>
            <p className="email-sub">
              Join the list. Get fresh meal ideas, macro tips, and the occasional food rant from Joe.
            </p>
            <form
              className="email-form"
              action="https://joesmealmap.beehiiv.com/subscribe"
              method="POST"
              target="_blank"
              rel="noopener noreferrer"
            >
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                required
                className="email-input"
              />
              <button type="submit" className="btn-primary email-submit">
                Subscribe
              </button>
            </form>
            <p className="email-fine">No spam. Unsubscribe any time.</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="site-footer">
          <div className="footer-inner">
            <div className="footer-logo">Joe&apos;s MealMap</div>
            <div className="footer-links">
              <Link href="/">Home</Link>
              <Link href="/recipes">Recipes</Link>
              <Link href="/planner">Planner</Link>
              <Link href="/about">About</Link>
            </div>
            <p className="footer-copy">
              © {new Date().getFullYear()} Joe&apos;s MealMap. Built by Joe Jennings.
            </p>
          </div>
        </footer>

      </main>
    </>
  );
}
```

- [ ] **Step 2: Delete the now-redundant `app/home/page.tsx`**

```bash
rm /Users/josephjennings/Desktop/JoesMealMap/app/home/page.tsx
rmdir /Users/josephjennings/Desktop/JoesMealMap/app/home
```

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git rm app/home/page.tsx
git commit -m "feat: promote homepage to / — was /home, links updated"
```

---

### Task 3: Update `next.config.ts` — add 301 redirect from `/home` to `/`

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Write the updated config**

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
```

- [ ] **Step 2: Commit**

```bash
git add next.config.ts
git commit -m "feat: add 301 redirect /home → /"
```

---

### Task 4: Update `components/NavBar.tsx`

All seven link targets need updating. The logo and Home link both move from `/home` to `/`. The Planner link and the two CTA links move from `/` to `/planner`. The active-state checks (`pathname === '/home'`, `pathname === '/'`) must also be updated to match.

**Files:**
- Modify: `components/NavBar.tsx`

- [ ] **Step 1: Write the updated NavBar**

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();

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
          <Link href="/about" className={`site-nav-link${pathname === '/about' ? ' active' : ''}`}>
            About
          </Link>
          <Link href="/planner" className="site-nav-cta">
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
          <Link href="/" className={pathname === '/' ? 'active' : ''}>Home</Link>
          <Link href="/planner" className={pathname === '/planner' ? 'active' : ''}>Planner</Link>
          <Link href="/recipes" className={pathname?.startsWith('/recipes') ? 'active' : ''}>Recipes</Link>
          <Link href="/about" className={pathname === '/about' ? 'active' : ''}>About</Link>
          <Link href="/planner" className="mobile-cta">Start Planning →</Link>
        </div>
      </details>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/NavBar.tsx
git commit -m "feat: update NavBar links — Home→/, Planner→/planner, order: Home|Planner|Recipes|About"
```

---

### Task 5: Update `app/recipes/[slug]/page.tsx`

The "Add to meal plan" button currently links to `/`. It should link to `/planner`.

**Files:**
- Modify: `app/recipes/[slug]/page.tsx`

- [ ] **Step 1: Update the link (line 150)**

Change:
```tsx
<Link href="/" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
  Add to meal plan →
</Link>
```

To:
```tsx
<Link href="/planner" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
  Add to meal plan →
</Link>
```

- [ ] **Step 2: Commit**

```bash
git add app/recipes/[slug]/page.tsx
git commit -m "feat: update recipe detail 'Add to meal plan' link to /planner"
```

---

### Task 6: Update `app/about/page.tsx`

Two areas need updating:
1. CTA section (line 100): `href="/"` → `href="/planner"`
2. Footer (lines 109, 111): `/home` → `/` and `/` → `/planner`

**Files:**
- Modify: `app/about/page.tsx`

- [ ] **Step 1: Update the CTA link**

Change:
```tsx
<Link href="/" className="btn-primary">Open the Planner →</Link>
```

To:
```tsx
<Link href="/planner" className="btn-primary">Open the Planner →</Link>
```

- [ ] **Step 2: Update the footer links**

Change:
```tsx
<Link href="/home">Home</Link>
<Link href="/recipes">Recipes</Link>
<Link href="/">Planner</Link>
<Link href="/about">About</Link>
```

To:
```tsx
<Link href="/">Home</Link>
<Link href="/recipes">Recipes</Link>
<Link href="/planner">Planner</Link>
<Link href="/about">About</Link>
```

- [ ] **Step 3: Commit**

```bash
git add app/about/page.tsx
git commit -m "feat: update about page CTA and footer links to new routes"
```

---

### Task 7: Build verification

Run a production build to confirm TypeScript compiles cleanly and no broken imports or routes remain.

- [ ] **Step 1: Run the build**

```bash
cd /Users/josephjennings/Desktop/JoesMealMap && npm run build
```

Expected: build completes with no errors. The output should list routes including `/`, `/planner`, `/recipes`, `/about`, `/recipes/[slug]`.

- [ ] **Step 2: Confirm routes in build output**

Look for these lines in the build output:
```
○ /
○ /about
○ /planner
○ /recipes
● /recipes/[slug]
```

If any route is missing or there's a TypeScript error, investigate before proceeding.

---

### Task 8: Push to GitHub

- [ ] **Step 1: Verify clean state**

```bash
git status
```

Expected: `nothing to commit, working tree clean`

- [ ] **Step 2: Push**

```bash
git push origin main
```

Expected: `main -> main` with no errors.

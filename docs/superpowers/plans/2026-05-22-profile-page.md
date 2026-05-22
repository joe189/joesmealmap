# Profile Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `app/profile/page.tsx` — an authenticated user profile page showing saved recipes (grid) and saved plans (expand/collapse list), redirecting unauthenticated visitors to `/login`.

**Architecture:** Single `'use client'` component with `force-dynamic`. Auth check and data fetch in `useEffect` hooks. Recipe name/cal resolved from the in-memory `MEALS` array by slug. Inline style objects throughout, matching the pattern of `login/page.tsx` and `NavBar.tsx`.

**Tech Stack:** Next.js App Router, React `useState`/`useEffect`, Supabase JS client (`lib/supabase.ts`), `next/navigation` `useRouter`, `next/link`, `next/image` (or `<img>`).

---

## Files

- **Create:** `app/profile/page.tsx` — the entire page

---

### Task 1: Scaffold the page with auth guard

**Files:**
- Create: `app/profile/page.tsx`

- [ ] **Step 1: Create the file with auth-redirect skeleton**

```tsx
'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import NavBar from '@/components/NavBar';

export default function ProfilePage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace('/login');
      } else {
        setEmail(user.email ?? '');
        setLoading(false);
      }
    });
  }, [router]);

  if (loading) {
    return (
      <>
        <NavBar />
        <div style={styles.page}>
          <p style={styles.loadingText}>Loading…</p>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div style={styles.page}>
        <div style={styles.inner}>
          <p>Profile for {email}</p>
        </div>
      </div>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#f7f6f2',
    fontFamily: "'DM Sans', sans-serif",
    paddingBottom: 60,
  },
  inner: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '40px 24px',
  },
  loadingText: {
    textAlign: 'center',
    padding: 60,
    color: '#888',
    fontSize: 14,
  },
};
```

- [ ] **Step 2: Start dev server and verify redirect**

```bash
npm run dev
```

Open `http://localhost:3000/profile` while logged out — should redirect to `/login`.
Open while logged in — should show "Profile for you@example.com".

- [ ] **Step 3: Commit**

```bash
git add app/profile/page.tsx
git commit -m "Add profile page scaffold with auth guard"
```

---

### Task 2: Header section (avatar, email, Edit Profile button)

**Files:**
- Modify: `app/profile/page.tsx`

- [ ] **Step 1: Replace the placeholder `<p>Profile for…</p>` with the header**

Replace the inner content of the `<div style={styles.inner}>` with:

```tsx
{/* Header */}
<div style={styles.header}>
  <div style={styles.avatar}>
    {email[0]?.toUpperCase() ?? 'U'}
  </div>
  <div style={styles.headerInfo}>
    <p style={styles.emailText}>{email}</p>
    <button style={styles.editBtn} disabled>Edit Profile</button>
  </div>
</div>
```

- [ ] **Step 2: Add header styles to the `styles` object**

```tsx
header: {
  display: 'flex',
  alignItems: 'center',
  gap: 20,
  marginBottom: 40,
},
avatar: {
  width: 64,
  height: 64,
  borderRadius: '50%',
  background: '#22C55E',
  color: '#fff',
  fontSize: 26,
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  fontFamily: "'DM Sans', sans-serif",
},
headerInfo: {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
},
emailText: {
  fontSize: 18,
  fontWeight: 600,
  color: '#1a1a1a',
  letterSpacing: '-0.2px',
},
editBtn: {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '7px 14px',
  fontSize: 13,
  fontWeight: 600,
  fontFamily: "'DM Sans', sans-serif",
  color: '#1a1a1a',
  background: '#fff',
  border: '1.5px solid #E5E7EB',
  borderRadius: 8,
  cursor: 'not-allowed',
  opacity: 0.4,
  width: 'fit-content',
},
```

- [ ] **Step 3: Verify in browser**

Header shows green circle with initial, email, and greyed-out "Edit Profile" button.

- [ ] **Step 4: Commit**

```bash
git add app/profile/page.tsx
git commit -m "Add profile page header with avatar and edit button"
```

---

### Task 3: Fetch saved recipes and render grid

**Files:**
- Modify: `app/profile/page.tsx`

- [ ] **Step 1: Add saved recipes state and fetch**

Add imports at the top of the file:

```tsx
import { MEALS } from '@/lib/meals-data';
```

Add state variables after the existing `useState` declarations:

```tsx
const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
```

Add a second `useEffect` after the first one (auth check):

```tsx
useEffect(() => {
  if (!email) return;
  const supabase = createClient();
  supabase
    .from('saved_recipes')
    .select('slug')
    .then(({ data }) => {
      setSavedSlugs((data ?? []).map((r: { slug: string }) => r.slug));
    });
}, [email]);
```

- [ ] **Step 2: Resolve recipe objects from MEALS**

Add this derived value inside the component body, before the return:

```tsx
const savedRecipes = savedSlugs
  .map(slug => MEALS.find(m => m.slug === slug))
  .filter((m): m is NonNullable<typeof m> => m !== undefined);
```

- [ ] **Step 3: Add the Saved Recipes section to JSX**

Add below the header `<div>`:

```tsx
{/* Saved Recipes */}
<section style={styles.section}>
  <h2 style={styles.sectionHeading}>
    Saved Recipes
    <span style={styles.countBadge}>{savedRecipes.length}</span>
  </h2>
  {savedRecipes.length === 0 ? (
    <p style={styles.emptyText}>
      No saved recipes yet.{' '}
      <Link href="/recipes" style={styles.emptyLink}>Browse recipes →</Link>
    </p>
  ) : (
    <div style={styles.recipeGrid}>
      {savedRecipes.map(recipe => (
        <Link key={recipe.slug} href={`/recipes/${recipe.slug}`} style={styles.recipeCard}>
          <div style={styles.recipeImgWrap}>
            <img
              src={`/recipes/${recipe.slug}.jpg`}
              alt={recipe.name}
              style={styles.recipeImg}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                const parent = (e.target as HTMLImageElement).parentElement;
                if (parent) parent.dataset.fallback = '1';
              }}
            />
            <div style={styles.recipeImgFallback}>🍴</div>
          </div>
          <div style={styles.recipeCardBody}>
            <p style={styles.recipeName}>{recipe.name}</p>
            <span style={styles.calBadge}>{recipe.cal} cal</span>
          </div>
        </Link>
      ))}
    </div>
  )}
</section>
```

- [ ] **Step 4: Add recipe grid styles to `styles`**

```tsx
section: {
  marginBottom: 48,
},
sectionHeading: {
  fontSize: 18,
  fontWeight: 600,
  color: '#1a1a1a',
  letterSpacing: '-0.2px',
  marginBottom: 16,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
},
countBadge: {
  fontSize: 12,
  fontWeight: 600,
  background: '#f0fdf4',
  color: '#166534',
  border: '1px solid #bbf7d0',
  borderRadius: 99,
  padding: '2px 8px',
},
emptyText: {
  fontSize: 14,
  color: '#888',
},
emptyLink: {
  color: '#22C55E',
  fontWeight: 600,
  textDecoration: 'none',
},
recipeGrid: {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: 16,
},
recipeCard: {
  background: '#fff',
  border: '1px solid rgba(0,0,0,0.08)',
  borderRadius: 12,
  overflow: 'hidden',
  textDecoration: 'none',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.15s',
},
recipeImgWrap: {
  width: '100%',
  aspectRatio: '4/3',
  background: '#f3f4f6',
  overflow: 'hidden',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
},
recipeImg: {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
},
recipeImgFallback: {
  position: 'absolute',
  fontSize: 32,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  pointerEvents: 'none',
},
recipeCardBody: {
  padding: '12px 14px',
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  flex: 1,
},
recipeName: {
  fontSize: 14,
  fontWeight: 600,
  color: '#1a1a1a',
  lineHeight: 1.3,
},
calBadge: {
  fontSize: 12,
  fontWeight: 600,
  background: '#fff8ed',
  color: '#a05000',
  borderRadius: 99,
  padding: '2px 8px',
  width: 'fit-content',
},
```

- [ ] **Step 5: Verify in browser**

Log in, save a recipe from the recipe page, then visit `/profile` — the card should appear with photo, name, and calorie badge.

- [ ] **Step 6: Commit**

```bash
git add app/profile/page.tsx
git commit -m "Add saved recipes grid to profile page"
```

---

### Task 4: Fetch saved plans and render expand/collapse list

**Files:**
- Modify: `app/profile/page.tsx`

- [ ] **Step 1: Add saved plans state and fetch**

Add the state variable:

```tsx
const [savedPlans, setSavedPlans] = useState<Array<{
  id: number | string;
  plan_data: {
    savedAt: string;
    picks: Record<string, Array<{ name: string; slug: string; cal: number }>>;
  };
}>>([]);
const [expandedPlanIds, setExpandedPlanIds] = useState<Set<number | string>>(new Set());
```

Extend the second `useEffect` to also fetch plans (replace the existing second `useEffect`):

```tsx
useEffect(() => {
  if (!email) return;
  const supabase = createClient();

  supabase
    .from('saved_recipes')
    .select('slug')
    .then(({ data }) => {
      setSavedSlugs((data ?? []).map((r: { slug: string }) => r.slug));
    });

  supabase
    .from('saved_plans')
    .select('id, plan_data')
    .order('id', { ascending: false })
    .then(({ data }) => {
      setSavedPlans(data ?? []);
    });
}, [email]);
```

- [ ] **Step 2: Add toggle handler**

Add inside the component body before the return:

```tsx
function togglePlan(id: string) {
  setExpandedPlanIds(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
}
```

- [ ] **Step 3: Add the Saved Plans section to JSX**

Add below the Saved Recipes section:

```tsx
{/* Saved Plans */}
<section style={styles.section}>
  <h2 style={styles.sectionHeading}>
    Saved Plans
    <span style={styles.countBadge}>{savedPlans.length}</span>
  </h2>
  {savedPlans.length === 0 ? (
    <p style={styles.emptyText}>
      No saved plans yet.{' '}
      <Link href="/planner" style={styles.emptyLink}>Build a plan →</Link>
    </p>
  ) : (
    <div style={styles.planList}>
      {savedPlans.map(plan => {
        const isExpanded = expandedPlanIds.has(plan.id);
        const date = new Date(plan.plan_data.savedAt).toLocaleDateString('en-US', {
          month: 'long', day: 'numeric', year: 'numeric',
        });
        const mealTypes = Object.entries(plan.plan_data.picks ?? {}).filter(
          ([, meals]) => meals.length > 0
        );
        return (
          <div key={plan.id} style={styles.planCard}>
            <button
              style={styles.planHeader}
              onClick={() => togglePlan(plan.id)}
              aria-expanded={isExpanded}
            >
              <span style={styles.planDate}>{date}</span>
              <span style={styles.chevron}>{isExpanded ? '▲' : '▼'}</span>
            </button>
            {isExpanded && (
              <div style={styles.planBody}>
                {mealTypes.map(([type, meals]) => (
                  <div key={type} style={styles.planMealRow}>
                    <p style={styles.planMealType}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </p>
                    <div style={styles.planMeals}>
                      {meals.map((meal, i) => (
                        <div key={i} style={styles.planMealItem}>
                          <span style={styles.planMealName}>{meal.name}</span>
                          <span style={styles.calBadge}>{meal.cal} cal</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  )}
</section>
```

- [ ] **Step 4: Add plan styles to `styles`**

```tsx
planList: {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
},
planCard: {
  background: '#fff',
  border: '1px solid rgba(0,0,0,0.08)',
  borderRadius: 12,
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
},
planHeader: {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '14px 18px',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  fontFamily: "'DM Sans', sans-serif",
},
planDate: {
  fontSize: 14,
  fontWeight: 600,
  color: '#1a1a1a',
},
chevron: {
  fontSize: 10,
  color: '#888',
},
planBody: {
  borderTop: '1px solid rgba(0,0,0,0.06)',
  padding: '12px 18px',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
},
planMealRow: {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
},
planMealType: {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase' as const,
  color: '#888',
},
planMeals: {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
},
planMealItem: {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
},
planMealName: {
  fontSize: 13,
  color: '#1a1a1a',
},
```

- [ ] **Step 5: Verify in browser**

Save a plan from `/planner`, then visit `/profile` — the plan row should appear with the date. Click the chevron to expand and see meals listed by type.

- [ ] **Step 6: Commit**

```bash
git add app/profile/page.tsx
git commit -m "Add saved plans expand/collapse list to profile page"
```

---

### Task 5: Responsive grid fix

**Files:**
- Modify: `app/profile/page.tsx`

The recipe grid uses a fixed 3-column CSS grid via inline styles. Inline styles can't use `@media` queries, so we need a runtime approach.

- [ ] **Step 1: Add a window-width listener**

Add state:

```tsx
const [cols, setCols] = useState(3);
```

Add a `useEffect` for responsive columns:

```tsx
useEffect(() => {
  function update() {
    setCols(window.innerWidth < 500 ? 1 : window.innerWidth < 768 ? 2 : 3);
  }
  update();
  window.addEventListener('resize', update);
  return () => window.removeEventListener('resize', update);
}, []);
```

- [ ] **Step 2: Use `cols` in the grid style**

Change the `recipeGrid` usage in JSX from `style={styles.recipeGrid}` to:

```tsx
style={{ ...styles.recipeGrid, gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
```

- [ ] **Step 3: Verify in browser**

Resize the browser — grid should collapse to 2 columns below 768px and 1 column below 500px.

- [ ] **Step 4: Commit**

```bash
git add app/profile/page.tsx
git commit -m "Add responsive columns to profile recipe grid"
```

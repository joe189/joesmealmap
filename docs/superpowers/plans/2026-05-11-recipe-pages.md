# Recipe Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename meal3→snack throughout the planner, build a filterable recipe index at `/recipes`, and auto-generate individual recipe pages at `/recipes/[slug]` from `lib/recipes-merged.json`.

**Architecture:** Server component shells import `recipes-merged.json` at build time. A `'use client'` `RecipeFilterGrid` component handles search and filter state. Individual pages use `generateStaticParams` for full static generation.

**Tech Stack:** Next.js 15 App Router, TypeScript, custom CSS (globals.css), no external UI libraries.

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `lib/meals.ts` | Update `MealType` union + all `type: 'meal3'` entries |
| Modify | `lib/meal-utils.ts` | Update `type === 'meal3'` guard |
| Modify | `components/MealMap.tsx` | Update all `meal3` string keys, labels, and banner text |
| Modify | `lib/recipes-merged.json` | Update 10 entries: `"type": "meal3"` → `"type": "snack"` |
| Modify | `app/globals.css` | Add recipe index + detail page CSS |
| Create | `components/RecipeFilterGrid.tsx` | Client component: filter pills, search bar, recipe card grid |
| Replace | `app/recipes/page.tsx` | Server component: import JSON, render header + RecipeFilterGrid |
| Create | `app/recipes/[slug]/page.tsx` | Server component: generateStaticParams, generateMetadata, recipe detail |

---

## Task 1: Update MealType in meals.ts

**Files:**
- Modify: `lib/meals.ts`

- [ ] **Step 1: Update MealType union and all meal3 entries**

In `lib/meals.ts`, change line 1:
```ts
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'meal3';
```
→
```ts
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
```

Then do a global find-and-replace in the file: `type:'meal3'` → `type:'snack'` (affects all ~10 snack meal entries).

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/josephjennings/Desktop/joesmealmap && npx tsc --noEmit 2>&1 | head -30
```

Expected: errors only in `MealMap.tsx` and `meal-utils.ts` (because they still reference `'meal3'`) — not in `meals.ts` itself.

- [ ] **Step 3: Commit**

```bash
cd /Users/josephjennings/Desktop/joesmealmap && git add lib/meals.ts && git commit -m "rename meal3 to snack in MealType and meal entries"
```

---

## Task 2: Update meal-utils.ts

**Files:**
- Modify: `lib/meal-utils.ts:36`

- [ ] **Step 1: Update the type guard**

In `lib/meal-utils.ts`, line 36:
```ts
if (type === 'meal3') return dietaryOk(m, excluded);
```
→
```ts
if (type === 'snack') return dietaryOk(m, excluded);
```

- [ ] **Step 2: Verify**

```bash
cd /Users/josephjennings/Desktop/joesmealmap && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors in `meal-utils.ts`. Remaining errors should only be in `MealMap.tsx`.

- [ ] **Step 3: Commit**

```bash
cd /Users/josephjennings/Desktop/joesmealmap && git add lib/meal-utils.ts && git commit -m "update meal-utils type guard: meal3 → snack"
```

---

## Task 3: Update MealMap.tsx

**Files:**
- Modify: `components/MealMap.tsx`

- [ ] **Step 1: Update TYPE_LABELS**

Find and replace in `MealMap.tsx`:
```ts
meal3: '⚡ Meal 3 (lighter)',
```
→
```ts
snack: '⚡ Snack (lighter)',
```

- [ ] **Step 2: Update activeMealTypes**

```ts
() => skipBreakfast ? ['lunch', 'dinner', 'meal3'] : ['breakfast', 'lunch', 'dinner'],
```
→
```ts
() => skipBreakfast ? ['lunch', 'dinner', 'snack'] : ['breakfast', 'lunch', 'dinner'],
```

- [ ] **Step 3: Update picks and options initial state**

Both `useState` calls that initialize with `{ breakfast: [], lunch: [], dinner: [], meal3: [] }`:
```ts
const [picks, setPicks] = useState<Record<MealType, Meal[]>>({
  breakfast: [], lunch: [], dinner: [], meal3: [],
});
const [options, setOptions] = useState<Record<MealType, Meal[]>>({
  breakfast: [], lunch: [], dinner: [], meal3: [],
});
```
→
```ts
const [picks, setPicks] = useState<Record<MealType, Meal[]>>({
  breakfast: [], lunch: [], dinner: [], snack: [],
});
const [options, setOptions] = useState<Record<MealType, Meal[]>>({
  breakfast: [], lunch: [], dinner: [], snack: [],
});
```

- [ ] **Step 4: Update handleResetEverything**

```ts
setPicks({ breakfast: [], lunch: [], dinner: [], meal3: [] });
setOptions({ breakfast: [], lunch: [], dinner: [], meal3: [] });
```
→
```ts
setPicks({ breakfast: [], lunch: [], dinner: [], snack: [] });
setOptions({ breakfast: [], lunch: [], dinner: [], snack: [] });
```

- [ ] **Step 5: Update handleGenerate**

```ts
const currentPicks = showPickSection ? picks : { breakfast: [], lunch: [], dinner: [], meal3: [] } as Record<MealType, Meal[]>;
```
→
```ts
const currentPicks = showPickSection ? picks : { breakfast: [], lunch: [], dinner: [], snack: [] } as Record<MealType, Meal[]>;
```

- [ ] **Step 6: Update the IF banner text**

```tsx
<div className="if-banner">
  <strong>⏭ Skipping breakfast</strong> — pick a Lunch, Dinner, and Meal 3 (lighter protein hit). Macros are spread across your 3 meals.
</div>
```
→
```tsx
<div className="if-banner">
  <strong>⏭ Skipping breakfast</strong> — pick a Lunch, Dinner, and Snack (lighter protein hit). Macros are spread across your 3 meals.
</div>
```

- [ ] **Step 7: Verify TypeScript compiles with zero errors**

```bash
cd /Users/josephjennings/Desktop/joesmealmap && npx tsc --noEmit 2>&1 | head -30
```

Expected: no output (zero errors).

- [ ] **Step 8: Commit**

```bash
cd /Users/josephjennings/Desktop/joesmealmap && git add components/MealMap.tsx && git commit -m "rename meal3 to snack throughout MealMap: labels, state keys, banner text"
```

---

## Task 4: Update recipes-merged.json

**Files:**
- Modify: `lib/recipes-merged.json`

- [ ] **Step 1: Replace all meal3 type entries**

Run this to confirm count before changing:
```bash
cd /Users/josephjennings/Desktop/joesmealmap && grep -c '"type": "meal3"' lib/recipes-merged.json
```
Expected: `10`

- [ ] **Step 2: Apply the replacement**

```bash
cd /Users/josephjennings/Desktop/joesmealmap && sed -i '' 's/"type": "meal3"/"type": "snack"/g' lib/recipes-merged.json
```

- [ ] **Step 3: Verify**

```bash
cd /Users/josephjennings/Desktop/joesmealmap && grep '"type": "meal3"' lib/recipes-merged.json | wc -l && grep '"type": "snack"' lib/recipes-merged.json | wc -l
```
Expected: `0` meal3 entries, `10` snack entries.

- [ ] **Step 4: Fix TYPE_LABEL in app/home/page.tsx**

In `app/home/page.tsx`, line ~41, update the `TYPE_LABEL` constant:
```ts
const TYPE_LABEL: Record<string, string> = {
  breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', meal3: 'Snack',
};
```
→
```ts
const TYPE_LABEL: Record<string, string> = {
  breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack',
};
```

- [ ] **Step 5: Commit**

```bash
cd /Users/josephjennings/Desktop/joesmealmap && git add lib/recipes-merged.json app/home/page.tsx && git commit -m "update recipes-merged.json: type meal3 → snack; fix TYPE_LABEL in home page"
```

---

## Task 5: Add CSS to globals.css

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Append new CSS at the end of globals.css**

Add the following block at the very end of `app/globals.css`:

```css
/* ═══════════════════════════════════════════════════════
   RECIPE INDEX PAGE
════════════════════════════════════════════════════════ */
.recipes-page-main{background:#fafaf8;min-height:100vh;padding-bottom:80px}
.recipes-page-header{padding:60px 0 40px;text-align:center}

.filter-row{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;justify-content:center}
.filter-pill{padding:8px 18px;font-size:13px;font-weight:500;font-family:var(--font-dm-sans),'DM Sans',sans-serif;border-radius:99px;border:1.5px solid var(--border-strong);background:var(--bg);color:var(--text-muted);cursor:pointer;transition:all 0.15s;user-select:none}
.filter-pill:hover{border-color:#999;color:var(--text)}
.filter-pill.active{background:#1a1a1a;color:#fff;border-color:#1a1a1a}

.recipes-search{width:100%;padding:12px 16px;font-size:14px;font-family:var(--font-dm-sans),'DM Sans',sans-serif;border:1.5px solid var(--border-strong);border-radius:var(--radius-sm);background:var(--surface);color:var(--text);outline:none;margin-bottom:10px;transition:border-color 0.15s;display:block}
.recipes-search:focus{border-color:var(--text)}

.recipes-count{font-size:12px;color:var(--text-muted);font-family:'DM Mono',monospace;margin-bottom:20px}

.recipes-empty{text-align:center;padding:60px 24px;color:var(--text-muted)}
.recipes-empty p{font-size:15px;margin-bottom:16px}

.recipe-card-name-overlay{position:absolute;bottom:0;left:0;right:0;padding:10px 14px;background:rgba(255,255,255,0.88);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);font-size:13px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

.rcm-cost{background:#f5f5f5;color:var(--text-muted)}

/* ═══════════════════════════════════════════════════════
   RECIPE DETAIL PAGE
════════════════════════════════════════════════════════ */
.recipe-detail-main{background:#fafaf8;min-height:100vh;padding-bottom:80px}

.breadcrumb{font-size:13px;color:var(--text-muted);padding:24px 0 16px}
.breadcrumb a{color:var(--text-muted);text-decoration:none;transition:color 0.15s}
.breadcrumb a:hover{color:var(--text)}

.recipe-hero{position:relative;height:320px;border-radius:20px;background:#f0ede6;overflow:hidden;display:flex;align-items:center;justify-content:center;margin-bottom:36px}
.recipe-hero-emoji{font-size:96px;line-height:1}
.recipe-hero-overlay{position:absolute;bottom:0;left:0;right:0;padding:20px 28px;background:rgba(0,0,0,0.45);display:flex;flex-direction:column;gap:6px}
.recipe-hero-name{font-size:clamp(22px,3vw,32px);font-weight:600;color:#fff;letter-spacing:-0.4px;line-height:1.2}

.recipe-detail-layout{display:grid;grid-template-columns:1fr 340px;gap:48px;align-items:start}
.recipe-detail-right{position:sticky;top:80px;display:flex;flex-direction:column;gap:16px}

.recipe-macro-card{display:grid;grid-template-columns:1fr 1fr;gap:8px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px;box-shadow:var(--shadow)}

.recipe-detail-left h2{font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--text-faint);margin-bottom:14px;padding-bottom:8px;border-bottom:1px solid var(--border)}
.recipe-detail-left section{margin-bottom:36px}

.recipe-ingredients-list{list-style:none;padding:0;margin:0}
.recipe-ingredient-row{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--border);font-size:14px}
.recipe-ingredient-row:last-child{border-bottom:none}
.ing-qty{font-family:'DM Mono',monospace;font-size:12px;color:var(--text-muted);min-width:70px;flex-shrink:0}
.ing-name{flex:1;color:var(--text)}

.recipe-steps-list{list-style:none;padding:0;margin:0}
.recipe-step{margin-bottom:24px;display:flex;flex-direction:column;gap:4px}
.recipe-step:last-child{margin-bottom:0}
.step-num-badge{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:99px;background:#1a1a1a;color:#fff;font-size:11px;font-weight:700;flex-shrink:0;margin-bottom:4px}
.step-title{font-size:14px;font-weight:600;color:var(--text)}
.step-body{font-size:14px;color:var(--text-muted);line-height:1.65;margin:0}

.recipe-tips{border-left:3px solid #1a1a1a;padding:4px 0 4px 18px;font-size:14px;color:var(--text-muted);line-height:1.65;font-style:italic;margin:0}
.recipe-meta-row{font-size:13px;color:var(--text-muted);font-family:'DM Mono',monospace;display:flex;gap:8px;flex-wrap:wrap;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px 14px}

@media(max-width:860px){
  .recipe-detail-layout{grid-template-columns:1fr}
  .recipe-detail-right{position:static}
  .recipe-hero{height:220px}
  .recipe-hero-emoji{font-size:64px}
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/josephjennings/Desktop/joesmealmap && git add app/globals.css && git commit -m "add recipe index and detail page CSS"
```

---

## Task 6: Create RecipeFilterGrid component

**Files:**
- Create: `components/RecipeFilterGrid.tsx`

- [ ] **Step 1: Create the file**

```tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';

type Recipe = {
  slug: string; name: string; type: string; proto: string;
  totalTime: number; cal: number; pro: number; carb: number;
  fat: number; cost: number; description: string;
};

const PROTO_COLORS: Record<string, { bg: string; text: string }> = {
  chicken: { bg: '#FFF3E0', text: '#E65100' },
  beef:    { bg: '#FCE4EC', text: '#C62828' },
  fish:    { bg: '#E3F2FD', text: '#1565C0' },
  yogurt:  { bg: '#F3E5F5', text: '#6A1B9A' },
  eggs:    { bg: '#FFFDE7', text: '#F57F17' },
  pork:    { bg: '#FBE9E7', text: '#BF360C' },
  legumes: { bg: '#E8F5E9', text: '#2E7D32' },
  tofu:    { bg: '#E0F2F1', text: '#00695C' },
};

const PROTO_EMOJI: Record<string, string> = {
  chicken: '🍗', beef: '🥩', fish: '🐟', yogurt: '🥛',
  eggs: '🥚', pork: '🐷', legumes: '🫘', tofu: '🌱',
};

const TYPE_LABEL: Record<string, string> = {
  breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack',
};

const VEGETARIAN_PROTOS = ['yogurt', 'eggs', 'legumes', 'tofu'];
const VEGAN_PROTOS = ['legumes', 'tofu'];

const FILTERS = [
  { id: 'breakfast',    label: 'Breakfast' },
  { id: 'lunch',        label: 'Lunch' },
  { id: 'dinner',       label: 'Dinner' },
  { id: 'snack',        label: 'Snacks' },
  { id: 'high-protein', label: 'High Protein' },
  { id: 'vegetarian',   label: 'Vegetarian' },
  { id: 'vegan',        label: 'Vegan' },
];

export default function RecipeFilterGrid({ recipes }: { recipes: Recipe[] }) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = recipes.filter(r => {
    const matchesFilter = !activeFilter || (
      activeFilter === 'high-protein' ? r.pro >= 30 :
      activeFilter === 'vegetarian'   ? VEGETARIAN_PROTOS.includes(r.proto) :
      activeFilter === 'vegan'        ? VEGAN_PROTOS.includes(r.proto) :
      r.type === activeFilter
    );
    const matchesSearch = !search || r.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <div className="filter-row">
        {FILTERS.map(f => (
          <button
            key={f.id}
            className={`filter-pill${activeFilter === f.id ? ' active' : ''}`}
            onClick={() => setActiveFilter(prev => prev === f.id ? null : f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <input
        type="search"
        className="recipes-search"
        placeholder="Search recipes…"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <p className="recipes-count">
        Showing {filtered.length} of {recipes.length} recipes
      </p>

      {filtered.length === 0 ? (
        <div className="recipes-empty">
          <p>No recipes match your filters.</p>
          <button
            className="filter-pill"
            onClick={() => { setActiveFilter(null); setSearch(''); }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="recipe-grid">
          {filtered.map(r => {
            const protoColor = PROTO_COLORS[r.proto] ?? { bg: '#F5F5F5', text: '#555' };
            return (
              <Link key={r.slug} href={`/recipes/${r.slug}`} className="recipe-card">
                <div className="recipe-card-img-wrap">
                  <div className="recipe-card-img-placeholder">
                    <span className="recipe-card-img-emoji">
                      {PROTO_EMOJI[r.proto] ?? '🍴'}
                    </span>
                  </div>
                  <div
                    className="recipe-card-proto-tag"
                    style={{ background: protoColor.bg, color: protoColor.text }}
                  >
                    {r.proto.charAt(0).toUpperCase() + r.proto.slice(1)}
                  </div>
                  <div className="recipe-card-type-tag">
                    {TYPE_LABEL[r.type] ?? r.type}
                  </div>
                  <div className="recipe-card-name-overlay">{r.name}</div>
                </div>
                <div className="recipe-card-body">
                  <p className="recipe-card-desc">{r.description}</p>
                  <div className="recipe-card-macros">
                    <span className="rcm rcm-cal">{r.cal} cal</span>
                    <span className="rcm rcm-pro">{r.pro}g protein</span>
                    <span className="rcm rcm-time">⏱ {r.totalTime} min</span>
                    <span className="rcm rcm-cost">~${r.cost}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd /Users/josephjennings/Desktop/joesmealmap && npx tsc --noEmit 2>&1 | head -20
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
cd /Users/josephjennings/Desktop/joesmealmap && git add components/RecipeFilterGrid.tsx && git commit -m "add RecipeFilterGrid client component with search and filter"
```

---

## Task 7: Replace app/recipes/page.tsx

**Files:**
- Replace: `app/recipes/page.tsx`

- [ ] **Step 1: Rewrite the file**

```tsx
import NavBar from '@/components/NavBar';
import RecipeFilterGrid from '@/components/RecipeFilterGrid';
import recipesRaw from '@/lib/recipes-merged.json';

type Recipe = {
  slug: string; name: string; type: string; proto: string;
  totalTime: number; cal: number; pro: number; carb: number;
  fat: number; cost: number; description: string; photoSearch: string;
};

const recipes = recipesRaw as Recipe[];

export const metadata = {
  title: "Recipes | Joe's MealMap",
  description: 'Browse all 100 high-protein recipes. Filter by meal type, dietary preference, or protein source.',
};

export default function RecipesPage() {
  return (
    <>
      <NavBar />
      <main className="recipes-page-main">
        <div className="section-inner">
          <header className="recipes-page-header">
            <span className="section-eyebrow">Recipe Index</span>
            <h1 className="section-title">100 meals. Built around your macros.</h1>
            <p className="section-sub">
              Browse all recipes, filter by type or goal, and click through for full ingredients and instructions.
            </p>
          </header>
          <RecipeFilterGrid recipes={recipes} />
        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd /Users/josephjennings/Desktop/joesmealmap && npx tsc --noEmit 2>&1 | head -20
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
cd /Users/josephjennings/Desktop/joesmealmap && git add app/recipes/page.tsx && git commit -m "build recipe index page with filter grid"
```

---

## Task 8: Create app/recipes/[slug]/page.tsx

**Files:**
- Create: `app/recipes/[slug]/page.tsx`

- [ ] **Step 1: Create the directory and file**

```bash
mkdir -p /Users/josephjennings/Desktop/joesmealmap/app/recipes/\[slug\]
```

- [ ] **Step 2: Write the file**

```tsx
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import recipesRaw from '@/lib/recipes-merged.json';

type Ingredient = { item: string; quantity: string };
type Step      = { step: number; title: string; instruction: string };
type Recipe = {
  slug: string; name: string; type: string; proto: string;
  prepTime: number; cookTime: number; totalTime: number; servings: number;
  cal: number; pro: number; carb: number; fat: number; cost: number;
  description: string; photoSearch: string;
  ingredients: Ingredient[]; steps: Step[]; tips?: string;
};

const recipes = recipesRaw as Recipe[];

const PROTO_EMOJI: Record<string, string> = {
  chicken: '🍗', beef: '🥩', fish: '🐟', yogurt: '🥛',
  eggs: '🥚', pork: '🐷', legumes: '🫘', tofu: '🌱',
};

const TYPE_LABEL: Record<string, string> = {
  breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack',
};

export async function generateStaticParams() {
  return recipes.map(r => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = recipes.find(r => r.slug === slug);
  if (!recipe) return {};
  return {
    title: `${recipe.name} | Joe's MealMap`,
    description: recipe.description,
  };
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = recipes.find(r => r.slug === slug);

  if (!recipe) {
    return (
      <>
        <NavBar />
        <main className="recipe-detail-main">
          <div className="section-inner">
            <nav className="breadcrumb">
              <Link href="/recipes">Recipes</Link> → Not found
            </nav>
            <p style={{ color: 'var(--text-muted)', padding: '40px 0' }}>
              Recipe not found. <Link href="/recipes" style={{ color: 'var(--text)' }}>Browse all recipes →</Link>
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <main className="recipe-detail-main">
        <div className="section-inner">

          <nav className="breadcrumb">
            <Link href="/recipes">Recipes</Link> → {recipe.name}
          </nav>

          <div className="recipe-hero">
            <span className="recipe-hero-emoji">{PROTO_EMOJI[recipe.proto] ?? '🍴'}</span>
            <div className="recipe-hero-overlay">
              <span className="recipe-card-type-tag">
                {TYPE_LABEL[recipe.type] ?? recipe.type}
              </span>
              <h1 className="recipe-hero-name">{recipe.name}</h1>
            </div>
          </div>

          <div className="recipe-detail-layout">

            <div className="recipe-detail-left">
              <section>
                <h2>Ingredients</h2>
                <ul className="recipe-ingredients-list">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i} className="recipe-ingredient-row">
                      <span className="ing-qty">{ing.quantity}</span>
                      <span className="ing-name">{ing.item}</span>
                      <a
                        href={`https://www.walmart.com/search?q=${encodeURIComponent(ing.item)}`}
                        className="walmart-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        🛒 Walmart
                      </a>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2>Instructions</h2>
                <ol className="recipe-steps-list">
                  {recipe.steps.map(s => (
                    <li key={s.step} className="recipe-step">
                      <span className="step-num-badge">{s.step}</span>
                      <strong className="step-title">{s.title}</strong>
                      <p className="step-body">{s.instruction}</p>
                    </li>
                  ))}
                </ol>
              </section>
            </div>

            <aside className="recipe-detail-right">
              <div className="recipe-macro-card">
                <div className="stat-cell">
                  <div className="stat-val">{recipe.cal}</div>
                  <div className="stat-lbl">Calories</div>
                </div>
                <div className="stat-cell">
                  <div className="stat-val">{recipe.pro}g</div>
                  <div className="stat-lbl">Protein</div>
                </div>
                <div className="stat-cell">
                  <div className="stat-val">{recipe.carb}g</div>
                  <div className="stat-lbl">Carbs</div>
                </div>
                <div className="stat-cell">
                  <div className="stat-val">{recipe.fat}g</div>
                  <div className="stat-lbl">Fat</div>
                </div>
              </div>

              <div className="recipe-meta-row">
                <span>⏱ {recipe.totalTime} min</span>
                <span>· {recipe.servings} serving</span>
                <span>· ~${recipe.cost}</span>
              </div>

              {recipe.tips && (
                <blockquote className="recipe-tips">{recipe.tips}</blockquote>
              )}

              <Link href="/" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Add to meal plan →
              </Link>
            </aside>

          </div>
        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 3: Verify TypeScript**

```bash
cd /Users/josephjennings/Desktop/joesmealmap && npx tsc --noEmit 2>&1 | head -20
```

Expected: no output.

- [ ] **Step 4: Run a full build to confirm all 100 pages generate**

```bash
cd /Users/josephjennings/Desktop/joesmealmap && npm run build 2>&1 | tail -20
```

Expected: build succeeds, output shows `/recipes/[slug]` with 100 pages generated.

- [ ] **Step 5: Commit**

```bash
cd /Users/josephjennings/Desktop/joesmealmap && git add app/recipes/\[slug\]/page.tsx && git commit -m "add static recipe detail pages with ingredients, steps, macros, and Walmart links"
```

---

## Task 9: Smoke test in dev server

- [ ] **Step 1: Start dev server**

```bash
cd /Users/josephjennings/Desktop/joesmealmap && npm run dev
```

- [ ] **Step 2: Check planner page**

Open `http://localhost:3000`. Toggle "Skip breakfast". Confirm the IF banner says "Snack" not "Meal 3". Confirm the pick section header shows "⚡ Snack (lighter)".

- [ ] **Step 3: Check recipe index**

Open `http://localhost:3000/recipes`. Confirm:
- 100 recipe cards visible
- Filter pills work (Breakfast shows 30, Lunch 30, Dinner 30, Snacks 10)
- High Protein filter shows only recipes with pro ≥ 30
- Vegetarian filter shows yogurt/eggs/legumes/tofu protos only
- Search filters by name in real time
- Empty state appears when search has no results

- [ ] **Step 4: Check individual recipe page**

Open `http://localhost:3000/recipes/greek-yogurt-berry-bowl`. Confirm:
- Hero shows yogurt emoji + meal name overlay
- Breadcrumb links back to /recipes
- Ingredients list shows all items with Walmart links
- Instructions show numbered steps with step title + body
- Right sidebar shows cal/protein/carbs/fat macro card
- Tips blockquote appears
- "Add to meal plan →" button links to /

- [ ] **Step 5: Check home page featured recipes**

Open `http://localhost:3000/home`. Confirm featured recipe cards still render (they link to `/recipes/[slug]` which now exists).

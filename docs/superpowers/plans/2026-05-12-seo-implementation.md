# SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a complete SEO foundation across Joe's MealMap — global metadata, per-page metadata, dynamic recipe JSON-LD, breadcrumbs, related recipes, sitemap, robots.txt, and a scalable category landing page architecture.

**Architecture:** Use Next.js App Router native metadata APIs (`export const metadata` for static pages, `generateMetadata` for dynamic). All canonical URLs point to `https://www.joesmealmap.com`. Recipe JSON has no `seoDescription` or `image` field — use `description` and `/og-image.jpg` fallback throughout.

**Tech Stack:** Next.js 15 App Router, TypeScript, recipes-merged.json (100 recipes)

---

## Critical Data Notes

- Recipe fields: `slug, name, type, prepTime, cookTime, totalTime, servings, description, photoSearch, ingredients, steps, tips, proto, cal, pro, carb, fat, cost`
- **No `seoDescription` field** — use `recipe.description` everywhere
- **No `recipe.image` field** — use `/og-image.jpg` as OG fallback for all recipes
- `/public/` currently has only `joe.webp` — `og-image.jpg` does not exist yet (add TODO placeholder)
- `app/layout.tsx` has an `impact-site-verification` meta tag that **must be preserved**

---

## File Map

| Action | Path |
|--------|------|
| Modify | `app/layout.tsx` |
| Modify | `app/page.tsx` |
| Modify | `app/planner/page.tsx` |
| Modify | `app/recipes/page.tsx` |
| Modify | `app/about/page.tsx` |
| Modify | `app/recipes/[slug]/page.tsx` |
| Create | `app/sitemap.ts` |
| Create | `app/robots.ts` |
| Create | `lib/categories.ts` |
| Create | `app/(categories)/[category]/page.tsx` |

---

### Task 1: Global metadata in `app/layout.tsx`

Update global metadata. Keep the `impact-site-verification` meta tag and the DM_Sans/DM_Mono font setup. Remove the old simple `metadata` export and replace with the full version.

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Write the updated layout**

```tsx
import type { Metadata } from 'next';
import { DM_Sans, DM_Mono } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.joesmealmap.com'),

  title: {
    default: "Joe's MealMap | Free Meal Planner & Macro Tracker",
    template: "%s | Joe's MealMap",
  },

  description:
    "Plan your meals, hit your macros, and build your grocery list automatically with Joe's MealMap.",

  openGraph: {
    title: "Joe's MealMap",
    description:
      'Plan meals, track macros, and generate grocery lists automatically.',
    url: 'https://www.joesmealmap.com',
    siteName: "Joe's MealMap",
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: "Joe's MealMap",
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: "Joe's MealMap",
    description:
      'Plan meals, track macros, and generate grocery lists automatically.',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable}`}>
      <head>
        {/* eslint-disable-next-line @next/next/no-head-element */}
        <meta name="impact-site-verification" {...{ value: '5483f2ab-0f90-487e-8b6f-41ed79c7de80' }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/layout.tsx
git commit -m "feat(seo): add global metadata with OG, twitter, metadataBase to layout"
```

---

### Task 2: Static page metadata (4 pages in one commit)

Add or update `export const metadata` on four static pages. Each page already has the correct route from the previous restructure session. None of these pages use `'use client'` at the top level, so the `metadata` export works fine.

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/planner/page.tsx`
- Modify: `app/recipes/page.tsx`
- Modify: `app/about/page.tsx`

- [ ] **Step 1: Add metadata to `app/page.tsx`**

Insert this export at the very top of the file, before the import statements for Link and Image (after any existing imports but before the component). Actually insert it after the imports block, before the consts:

```tsx
export const metadata = {
  title: "Joe's MealMap",
  description:
    "Plan your meals, hit your macros, and build your grocery list automatically with Joe's MealMap.",
  alternates: {
    canonical: '/',
  },
};
```

NOTE: `title: "Joe's MealMap"` will become `"Joe's MealMap | Joe's MealMap"` via the template? No — when the title string exactly matches the default title, Next.js uses it as-is. Actually, the template `%s | Joe's MealMap` would apply: `"Joe's MealMap | Joe's MealMap"`. To avoid this, use `title: { absolute: "Joe's MealMap | Free Meal Planner & Macro Tracker" }` which bypasses the template.

Use this instead for the homepage:

```tsx
export const metadata = {
  title: {
    absolute: "Joe's MealMap | Free Meal Planner & Macro Tracker",
  },
  description:
    "Plan your meals, hit your macros, and build your grocery list automatically with Joe's MealMap.",
  alternates: {
    canonical: '/',
  },
};
```

- [ ] **Step 2: Add metadata to `app/planner/page.tsx`**

```tsx
import MealMap from '@/components/MealMap';

export const metadata = {
  title: 'Free Meal Planner & Macro Calculator',
  description:
    'Set your macro goals, choose meals for the week, and get an automatic grocery list. A free meal planning tool with high protein recipes.',
  alternates: {
    canonical: '/planner',
  },
};

export default function PlannerPage() {
  return <MealMap />;
}
```

`title: 'Free Meal Planner & Macro Calculator'` → template produces `"Free Meal Planner & Macro Calculator | Joe's MealMap"` ✓

- [ ] **Step 3: Update metadata in `app/recipes/page.tsx`**

The current file has `export const metadata = { title: "Recipes | Joe's MealMap", ... }`. Replace the entire `metadata` export with:

```tsx
export const metadata = {
  title: 'High Protein Recipes with Macros',
  description:
    'Browse high protein breakfasts, lunches, dinners, and snacks with macros, ingredients, and step by step instructions.',
  alternates: {
    canonical: '/recipes',
  },
};
```

- [ ] **Step 4: Add metadata to `app/about/page.tsx`**

Insert after the imports, before the `export default function AboutPage()` line:

```tsx
export const metadata = {
  title: "About Joe's MealMap",
  description:
    "Joe's MealMap was built by Joe Jennings to make meal planning, macros, and grocery lists simpler for people who want to eat well without eating boring food.",
  alternates: {
    canonical: '/about',
  },
};
```

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx app/planner/page.tsx app/recipes/page.tsx app/about/page.tsx
git commit -m "feat(seo): add page-level metadata with canonicals to all static pages"
```

---

### Task 3: Dynamic recipe metadata, JSON-LD, breadcrumbs, related recipes

This is the biggest task — a full rewrite of `app/recipes/[slug]/page.tsx`. Changes:

1. `generateMetadata` with proper title, description, canonical, OG, twitter
2. Recipe JSON-LD structured data
3. BreadcrumbList JSON-LD
4. Enhanced crawlable breadcrumb HTML nav
5. Related recipes section (server-rendered)

**Data constraints:**
- No `recipe.image` field → use `/og-image.jpg` for all OG images
- No `recipe.seoDescription` field → use `recipe.description`
- `recipe.prepTime` and `recipe.cookTime` are in minutes → convert to ISO 8601: `PT${n}M`
- `recipe.servings` is a number

**Title logic:**
- Base: `${recipe.name} | High Protein Recipe`
- If base.length > 60: use `{ absolute: recipe.name }` only
- Otherwise: `{ absolute: base }`

**Related recipe logic:**
- Same `type` + same `proto`, excluding current slug → strongest match
- If fewer than 3, fill from same `type` only, excluding current
- Max 4 results

**Files:**
- Modify: `app/recipes/[slug]/page.tsx`

- [ ] **Step 1: Write the complete updated file**

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

const BASE_URL = 'https://www.joesmealmap.com';
const OG_FALLBACK = '/og-image.jpg';

const PROTO_EMOJI: Record<string, string> = {
  chicken: '🍗', beef: '🥩', fish: '🐟', yogurt: '🥛',
  eggs: '🥚', pork: '🐷', legumes: '🫘', tofu: '🌱',
};

const TYPE_LABEL: Record<string, string> = {
  breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack',
};

function getRelatedRecipes(current: Recipe, max = 4): Recipe[] {
  const sameTypeSameProto = recipes.filter(
    r => r.slug !== current.slug && r.type === current.type && r.proto === current.proto
  );
  const sameTypeOnly = recipes.filter(
    r => r.slug !== current.slug && r.type === current.type && r.proto !== current.proto
  );

  const combined: Recipe[] = [];
  for (const r of sameTypeSameProto) {
    if (combined.length >= max) break;
    combined.push(r);
  }
  for (const r of sameTypeOnly) {
    if (combined.length >= max) break;
    combined.push(r);
  }
  return combined;
}

export async function generateStaticParams() {
  return recipes.map(r => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = recipes.find(r => r.slug === slug);
  if (!recipe) return {};

  const base = `${recipe.name} | High Protein Recipe`;
  const title = base.length <= 60 ? { absolute: base } : { absolute: recipe.name };

  return {
    title,
    description: recipe.description,
    alternates: {
      canonical: `/recipes/${recipe.slug}`,
    },
    openGraph: {
      title: recipe.name,
      description: recipe.description,
      url: `${BASE_URL}/recipes/${recipe.slug}`,
      type: 'article',
      images: [
        {
          url: OG_FALLBACK,
          width: 1200,
          height: 630,
          alt: recipe.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: recipe.name,
      description: recipe.description,
      images: [OG_FALLBACK],
    },
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
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link> →{' '}
              <Link href="/recipes">Recipes</Link> → Not found
            </nav>
            <p style={{ color: 'var(--text-muted)', padding: '40px 0' }}>
              Recipe not found.{' '}
              <Link href="/recipes" style={{ color: 'var(--text)' }}>Browse all recipes →</Link>
            </p>
          </div>
        </main>
      </>
    );
  }

  const related = getRelatedRecipes(recipe);

  const recipeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.name,
    description: recipe.description,
    image: [`${BASE_URL}${OG_FALLBACK}`],
    prepTime: `PT${recipe.prepTime}M`,
    cookTime: `PT${recipe.cookTime}M`,
    totalTime: `PT${recipe.totalTime}M`,
    recipeYield: `${recipe.servings} serving${recipe.servings !== 1 ? 's' : ''}`,
    recipeCategory: TYPE_LABEL[recipe.type] ?? recipe.type,
    recipeCuisine: 'American',
    recipeIngredient: recipe.ingredients.map(i => `${i.quantity} ${i.item}`),
    recipeInstructions: recipe.steps.map(s => ({
      '@type': 'HowToStep',
      name: s.title,
      text: s.instruction,
    })),
    nutrition: {
      '@type': 'NutritionInformation',
      calories: `${recipe.cal} calories`,
      proteinContent: `${recipe.pro}g`,
      carbohydrateContent: `${recipe.carb}g`,
      fatContent: `${recipe.fat}g`,
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Recipes', item: `${BASE_URL}/recipes` },
      { '@type': 'ListItem', position: 3, name: recipe.name, item: `${BASE_URL}/recipes/${recipe.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <NavBar />
      <main className="recipe-detail-main">
        <div className="section-inner">

          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link> →{' '}
            <Link href="/recipes">Recipes</Link> →{' '}
            {recipe.name}
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

              <Link href="/planner" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Add to meal plan →
              </Link>
            </aside>

          </div>

          {related.length > 0 && (
            <section className="related-recipes">
              <h2 className="related-recipes-title">More {TYPE_LABEL[recipe.type] ?? 'Recipes'} You Might Like</h2>
              <div className="related-recipes-grid">
                {related.map(r => (
                  <Link key={r.slug} href={`/recipes/${r.slug}`} className="related-recipe-card">
                    <span className="related-recipe-emoji">{PROTO_EMOJI[r.proto] ?? '🍴'}</span>
                    <div className="related-recipe-info">
                      <span className="related-recipe-name">{r.name}</span>
                      <span className="related-recipe-macros">{r.cal} cal · {r.pro}g protein</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/recipes/[slug]/page.tsx
git commit -m "feat(seo): add dynamic metadata, Recipe+Breadcrumb JSON-LD, breadcrumbs, related recipes"
```

---

### Task 4: Create `app/sitemap.ts`

**Files:**
- Create: `app/sitemap.ts`

- [ ] **Step 1: Write the sitemap**

```ts
import type { MetadataRoute } from 'next';
import recipesRaw from '@/lib/recipes-merged.json';

const BASE_URL = 'https://www.joesmealmap.com';

const recipes = recipesRaw as { slug: string }[];

export default function sitemap(): MetadataRoute.Sitemap {
  const recipeEntries: MetadataRoute.Sitemap = recipes.map(r => ({
    url: `${BASE_URL}/recipes/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/planner`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/recipes`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...recipeEntries,
  ];
}
```

- [ ] **Step 2: Verify TypeScript types compile**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add app/sitemap.ts
git commit -m "feat(seo): add dynamic sitemap with all recipe URLs"
```

---

### Task 5: Create `app/robots.ts`

**Files:**
- Create: `app/robots.ts`

- [ ] **Step 1: Write the robots config**

```ts
import type { MetadataRoute } from 'next';

const BASE_URL = 'https://www.joesmealmap.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/', '/admin/', '/account/', '/settings/', '/login/', '/signup/'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add app/robots.ts
git commit -m "feat(seo): add robots.ts with crawl rules and sitemap reference"
```

---

### Task 6: OG image placeholder

There is no `og-image.jpg` in `/public`. The metadata references it. Add a placeholder file with a TODO comment so the build doesn't break (Next.js does not throw a build error for missing referenced images in metadata — it's a runtime/browser concern, not a build concern). Add a visible TODO via a text file.

**Files:**
- No file needed for the build to pass (Next.js won't error on missing OG image references in metadata)
- Add a note to `public/` as documentation

- [ ] **Step 1: Create a placeholder readme in public**

Create `/public/OG_IMAGE_TODO.txt` with content:
```
TODO: Create og-image.jpg (1200x630px) for Open Graph social sharing.
This file is referenced in app/layout.tsx metadataBase and all recipe pages.
Design specs: Joe's MealMap branding, green accent color, white background.
```

- [ ] **Step 2: Commit**

```bash
git add public/OG_IMAGE_TODO.txt
git commit -m "chore: add OG image placeholder todo — og-image.jpg needed for social sharing"
```

---

### Task 7: Category landing page architecture

Create the scalable infrastructure for category landing pages (e.g., `/high-protein-breakfasts`).

Architecture:
- `lib/categories.ts` — defines all category configs (slug, title, description, filter function)
- `app/(categories)/[category]/page.tsx` — dynamic route that renders any defined category
- `export const dynamicParams = false` — ensures only defined categories are served; unknown slugs 404
- `generateStaticParams` — auto-generates pages from `CATEGORIES` array

To add a new category page in the future: add one entry to `lib/categories.ts`. That's it.

**Files:**
- Create: `lib/categories.ts`
- Create: `app/(categories)/[category]/page.tsx`

- [ ] **Step 1: Create `lib/categories.ts`**

```ts
export type CategoryRecipe = {
  slug: string;
  name: string;
  type: string;
  proto: string;
  cal: number;
  pro: number;
  carb: number;
  fat: number;
  totalTime: number;
  description: string;
  cost: number;
};

export type Category = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  filter: (recipe: CategoryRecipe) => boolean;
};

export const CATEGORIES: Category[] = [
  {
    slug: 'high-protein-breakfasts',
    title: 'High Protein Breakfasts',
    description:
      'Start your day strong with breakfasts that hit 25g+ of protein. Every recipe includes macros, ingredients, and step-by-step instructions.',
    eyebrow: 'Morning fuel',
    filter: r => r.type === 'breakfast' && r.pro >= 25,
  },
  {
    slug: 'high-protein-snacks',
    title: 'High Protein Snacks',
    description:
      'Smart snacks that keep you on track. 15g+ protein, macro-tracked, and actually worth eating.',
    eyebrow: 'Between meals',
    filter: r => r.type === 'snack' && r.pro >= 15,
  },
  {
    slug: 'meal-prep-recipes',
    title: 'Meal Prep Recipes',
    description:
      'Batch-friendly recipes that work all week. High protein, macro-tracked, and designed for efficient prep.',
    eyebrow: 'Prep once, eat all week',
    filter: r => r.pro >= 30,
  },
  {
    slug: 'under-500-calorie-meals',
    title: 'Under 500 Calorie Meals',
    description:
      'Full meals under 500 calories that still hit your protein targets. Great for fat loss and body recomp.',
    eyebrow: 'Lean eating',
    filter: r => r.cal < 500,
  },
  {
    slug: 'high-protein-dinners',
    title: 'High Protein Dinners',
    description:
      'Dinners built around your macro targets. 30g+ protein, full ingredients, and step-by-step instructions.',
    eyebrow: 'Evening meals',
    filter: r => r.type === 'dinner' && r.pro >= 30,
  },
];
```

- [ ] **Step 2: Create `app/(categories)/[category]/page.tsx`**

```tsx
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import { notFound } from 'next/navigation';
import { CATEGORIES, type CategoryRecipe } from '@/lib/categories';
import recipesRaw from '@/lib/recipes-merged.json';
import type { Metadata } from 'next';

export const dynamicParams = false;

const allRecipes = recipesRaw as CategoryRecipe[];

const PROTO_EMOJI: Record<string, string> = {
  chicken: '🍗', beef: '🥩', fish: '🐟', yogurt: '🥛',
  eggs: '🥚', pork: '🐷', legumes: '🫘', tofu: '🌱',
};

const TYPE_LABEL: Record<string, string> = {
  breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack',
};

export async function generateStaticParams() {
  return CATEGORIES.map(c => ({ category: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ category: string }> }
): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES.find(c => c.slug === category);
  if (!cat) return {};

  return {
    title: cat.title,
    description: cat.description,
    alternates: {
      canonical: `/${cat.slug}`,
    },
    openGraph: {
      title: cat.title,
      description: cat.description,
      url: `https://www.joesmealmap.com/${cat.slug}`,
      type: 'website',
    },
  };
}

export default async function CategoryPage(
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;
  const cat = CATEGORIES.find(c => c.slug === category);
  if (!cat) notFound();

  const matched = allRecipes.filter(cat.filter);

  return (
    <>
      <NavBar />
      <main className="recipes-page-main">
        <div className="section-inner">

          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link> →{' '}
            <Link href="/recipes">Recipes</Link> →{' '}
            {cat.title}
          </nav>

          <header className="recipes-page-header">
            <span className="section-eyebrow">{cat.eyebrow}</span>
            <h1 className="section-title">{cat.title}</h1>
            <p className="section-sub">{cat.description}</p>
            <p className="recipes-count">{matched.length} recipes</p>
          </header>

          <div className="recipe-grid">
            {matched.map(r => (
              <Link key={r.slug} href={`/recipes/${r.slug}`} className="recipe-card">
                <div className="recipe-card-img-wrap">
                  <div className="recipe-card-img-placeholder">
                    <span className="recipe-card-img-emoji">{PROTO_EMOJI[r.proto] ?? '🍴'}</span>
                  </div>
                  <div className="recipe-card-type-tag">{TYPE_LABEL[r.type] ?? r.type}</div>
                </div>
                <div className="recipe-card-body">
                  <h3 className="recipe-card-name">{r.name}</h3>
                  <p className="recipe-card-desc">{r.description}</p>
                  <div className="recipe-card-macros">
                    <span className="rcm rcm-cal">{r.cal} cal</span>
                    <span className="rcm rcm-pro">{r.pro}g protein</span>
                    <span className="rcm rcm-time">⏱ {r.totalTime} min</span>
                    <span className="rcm rcm-cost">~${r.cost}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="recipes-cta-row" style={{ marginTop: '48px' }}>
            <Link href="/planner" className="btn-primary">Plan my meals with these →</Link>
            <Link href="/recipes" className="btn-secondary" style={{ marginLeft: '12px' }}>
              Browse all recipes
            </Link>
          </div>

        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/categories.ts "app/(categories)/[category]/page.tsx"
git commit -m "feat(seo): add scalable category landing page architecture with 5 categories"
```

---

### Task 8: Build verification and push

- [ ] **Step 1: Run the production build**

```bash
npm run build 2>&1
```

Expected output should include:
```
✓ Compiled successfully
```

And routes including:
```
○ /
○ /about
○ /planner
○ /recipes
● /recipes/[slug]
○ /high-protein-breakfasts
○ /high-protein-snacks
○ /meal-prep-recipes
○ /under-500-calorie-meals
○ /high-protein-dinners
ƒ /api/send-plan
```

- [ ] **Step 2: Fix any TypeScript or build errors before proceeding**

If there are errors, fix them now. Do NOT commit broken code.

Common issues to watch for:
- Import type errors in `lib/categories.ts` (ensure `CategoryRecipe` fields match the JSON)
- `dynamicParams` export must be a `const`, not inside a function
- JSON-LD `dangerouslySetInnerHTML` requires the `__html` key exactly
- `MetadataRoute.Sitemap` changeFrequency must be a union literal type, not string

- [ ] **Step 3: Verify git state is clean**

```bash
git status
```

Expected: clean working tree (only the untracked plan doc should appear)

- [ ] **Step 4: Push to GitHub**

```bash
git push origin main
```

Expected: `main -> main` with no errors

- [ ] **Step 5: Report final summary**

Report:
- How many files were changed/created
- What routes were added
- Confirmed build output
- GitHub push confirmation

# Recipe Image Downloader & Display Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Write a Node.js script that downloads Unsplash images for all 100 recipes and update the recipe detail page and recipe card grid to display real images when they exist, falling back to the emoji placeholder otherwise.

**Architecture:** The download script runs outside Next.js (plain Node.js, CommonJS). Image display uses server-side `fs.existsSync` / `readdirSync` at build time in the two server components that need it; the client component `RecipeFilterGrid` receives a `slugsWithImages: string[]` prop from its server parent. No new npm dependencies.

**Tech Stack:** Node.js 18+ (built-in `fetch`), Next.js 15 App Router (server components), TypeScript, `fs` module

---

## Critical Notes

- `components/RecipeFilterGrid.tsx` is `'use client'` — **cannot** import `fs`. Must get image data from its server-parent as a prop.
- `public/recipes/` directory does not yet exist. The script creates it. Build-time `readdirSync` must be wrapped in try/catch.
- Unsplash `urls.regular` is a direct CDN HTTPS URL (e.g. `https://images.unsplash.com/photo-...`). Fetch it and save as binary.
- The UNSPLASH_ACCESS_KEY the user has is: `DLa5SRpUsI56m-jONw9yNCXX1006ud978byoBDfRA8w`
- Images saved to: `public/recipes/{slug}.jpg`
- Recipe JSON fields available: `slug`, `name`, `photoSearch`, plus the rest

---

## File Map

| Action | Path |
|--------|------|
| Create | `scripts/download-recipe-images.js` |
| Modify | `app/recipes/[slug]/page.tsx` |
| Modify | `components/RecipeFilterGrid.tsx` |
| Modify | `app/recipes/page.tsx` |

---

### Task 1: Create `scripts/download-recipe-images.js`

**Files:**
- Create: `scripts/download-recipe-images.js`

- [ ] **Step 1: Create the `scripts/` directory and write the file**

```js
'use strict';

const fs = require('fs');
const path = require('path');

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
if (!UNSPLASH_ACCESS_KEY) {
  console.error('Error: UNSPLASH_ACCESS_KEY environment variable is required');
  console.error('Usage: UNSPLASH_ACCESS_KEY=your_key node scripts/download-recipe-images.js');
  process.exit(1);
}

const RECIPES_PATH = path.join(__dirname, '..', 'lib', 'recipes-merged.json');
const OUTPUT_DIR   = path.join(__dirname, '..', 'public', 'recipes');

const recipes = JSON.parse(fs.readFileSync(RECIPES_PATH, 'utf8'));

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadBinary(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status} ${res.statusText}`);
  const buf = await res.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(buf));
}

async function main() {
  let downloaded = 0;
  let skipped = 0;

  for (const recipe of recipes) {
    const destPath = path.join(OUTPUT_DIR, `${recipe.slug}.jpg`);

    if (fs.existsSync(destPath)) {
      console.log(`Skipped: ${recipe.name} (already exists)`);
      skipped++;
      continue;
    }

    try {
      const query = encodeURIComponent(recipe.photoSearch);
      const apiUrl = `https://api.unsplash.com/search/photos?query=${query}&per_page=1&orientation=landscape`;

      const searchRes = await fetch(apiUrl, {
        headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
      });

      if (!searchRes.ok) {
        throw new Error(`API error: ${searchRes.status} ${searchRes.statusText}`);
      }

      const data = await searchRes.json();

      if (!data.results || data.results.length === 0) {
        console.log(`Skipped: ${recipe.name} (no Unsplash results)`);
        skipped++;
      } else {
        const imageUrl = data.results[0].urls.regular;
        await downloadBinary(imageUrl, destPath);
        console.log(`Downloaded: ${recipe.name}`);
        downloaded++;
      }
    } catch (err) {
      console.error(`Error: ${recipe.name} — ${err.message}`);
      skipped++;
    }

    await sleep(1000);
  }

  console.log(`\nDone — ${downloaded} downloaded, ${skipped} skipped`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
```

- [ ] **Step 2: Verify the script file exists**

```bash
ls scripts/download-recipe-images.js
```

Expected: file path printed, no error.

- [ ] **Step 3: Commit**

```bash
git add scripts/download-recipe-images.js
git commit -m "feat: add Unsplash recipe image download script"
```

---

### Task 2: Update `app/recipes/[slug]/page.tsx` — image-aware hero and metadata

The recipe detail page is a server component. Use `fs.existsSync` to check at build time whether a downloaded image exists for the current slug. Update:

1. The recipe hero section: show `<img>` when image exists, emoji span when it doesn't
2. `generateMetadata`: use the real image URL in OG/Twitter metadata when it exists
3. The Recipe JSON-LD `image` field: use the real image URL when it exists

**Files:**
- Modify: `app/recipes/[slug]/page.tsx`

- [ ] **Step 1: Add `fs` and `path` imports at the top of the file**

After the existing imports, add:

```ts
import { existsSync } from 'fs';
import { join } from 'path';
```

The full imports block should now be:

```ts
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import recipesRaw from '@/lib/recipes-merged.json';
import { existsSync } from 'fs';
import { join } from 'path';
```

- [ ] **Step 2: Update `generateMetadata` to use real image when available**

Replace the current `generateMetadata` function (lines 52–87) with:

```ts
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = recipes.find(r => r.slug === slug);
  if (!recipe) return {};

  const base = `${recipe.name} | High Protein Recipe`;
  const title = base.length <= 60 ? { absolute: base } : { absolute: recipe.name };

  const recipeImagePath = `/recipes/${recipe.slug}.jpg`;
  const ogImage = existsSync(join(process.cwd(), 'public', recipeImagePath))
    ? recipeImagePath
    : OG_FALLBACK;

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
      type: 'article' as const,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: recipe.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: recipe.name,
      description: recipe.description,
      images: [ogImage],
    },
  };
}
```

- [ ] **Step 3: Update `RecipePage` to check for image and render accordingly**

In the `RecipePage` component body, after `const related = getRelatedRecipes(recipe);` and before the JSON-LD objects, add:

```ts
const recipeImagePath = `/recipes/${recipe.slug}.jpg`;
const hasImage = existsSync(join(process.cwd(), 'public', recipeImagePath));
```

Update the `recipeJsonLd` `image` field to use the real image when available (currently hardcoded to `OG_FALLBACK`). Change:

```ts
image: [`${BASE_URL}${OG_FALLBACK}`],
```

To:

```ts
image: [`${BASE_URL}${hasImage ? recipeImagePath : OG_FALLBACK}`],
```

- [ ] **Step 4: Update the hero section to show image or emoji**

Replace the current hero block (lines 177–185):

```tsx
<div className="recipe-hero">
  <span className="recipe-hero-emoji">{PROTO_EMOJI[recipe.proto] ?? '🍴'}</span>
  <div className="recipe-hero-overlay">
    <span className="recipe-card-type-tag">
      {TYPE_LABEL[recipe.type] ?? recipe.type}
    </span>
    <h1 className="recipe-hero-name">{recipe.name}</h1>
  </div>
</div>
```

With:

```tsx
<div className="recipe-hero">
  {hasImage ? (
    <img
      src={recipeImagePath}
      alt={recipe.name}
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'absolute', top: 0, left: 0 }}
    />
  ) : (
    <span className="recipe-hero-emoji">{PROTO_EMOJI[recipe.proto] ?? '🍴'}</span>
  )}
  <div className="recipe-hero-overlay">
    <span className="recipe-card-type-tag">
      {TYPE_LABEL[recipe.type] ?? recipe.type}
    </span>
    <h1 className="recipe-hero-name">{recipe.name}</h1>
  </div>
</div>
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no output (zero errors).

- [ ] **Step 6: Commit**

```bash
git add "app/recipes/[slug]/page.tsx"
git commit -m "feat: show downloaded recipe image in hero and OG metadata when available"
```

---

### Task 3: Update `components/RecipeFilterGrid.tsx` — accept and use `slugsWithImages` prop

`RecipeFilterGrid` is a `'use client'` component and cannot read the filesystem. It receives `slugsWithImages: string[]` from its server parent and uses it to decide whether to render `<img>` or the emoji placeholder for each card.

**Files:**
- Modify: `components/RecipeFilterGrid.tsx`

- [ ] **Step 1: Add `slugsWithImages` to the props type and the function signature**

The component currently starts with:

```tsx
export default function RecipeFilterGrid({ recipes }: { recipes: Recipe[] }) {
```

Change to:

```tsx
export default function RecipeFilterGrid({
  recipes,
  slugsWithImages,
}: {
  recipes: Recipe[];
  slugsWithImages: string[];
}) {
  const imageSet = new Set(slugsWithImages);
```

The `imageSet` local variable converts the array to a `Set` for O(1) lookup.

- [ ] **Step 2: Update the recipe card image section**

Find the current card image block inside the `.map()` (around line 101):

```tsx
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
```

Replace with:

```tsx
<div className="recipe-card-img-wrap">
  {imageSet.has(r.slug) ? (
    <img
      src={`/recipes/${r.slug}.jpg`}
      alt={r.name}
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
    />
  ) : (
    <div className="recipe-card-img-placeholder">
      <span className="recipe-card-img-emoji">
        {PROTO_EMOJI[r.proto] ?? '🍴'}
      </span>
    </div>
  )}
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
```

- [ ] **Step 3: Commit**

```bash
git add components/RecipeFilterGrid.tsx
git commit -m "feat: show recipe image in cards when available, fall back to emoji"
```

---

### Task 4: Update `app/recipes/page.tsx` — compute `slugsWithImages` and pass as prop

This is the server component that renders `RecipeFilterGrid`. It reads the `public/recipes/` directory to find which slugs have downloaded images, then passes the slug list as a prop.

**Files:**
- Modify: `app/recipes/page.tsx`

- [ ] **Step 1: Add `fs` and `path` imports**

After the existing imports, add:

```ts
import { readdirSync } from 'fs';
import { join } from 'path';
```

Full imports block:

```ts
import NavBar from '@/components/NavBar';
import RecipeFilterGrid from '@/components/RecipeFilterGrid';
import recipesRaw from '@/lib/recipes-merged.json';
import { readdirSync } from 'fs';
import { join } from 'path';
```

- [ ] **Step 2: Compute `slugsWithImages` inside `RecipesPage` and pass the prop**

Replace the current `RecipesPage` component:

```tsx
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

With:

```tsx
export default function RecipesPage() {
  let slugsWithImages: string[] = [];
  try {
    slugsWithImages = readdirSync(join(process.cwd(), 'public', 'recipes'))
      .filter(f => f.endsWith('.jpg'))
      .map(f => f.replace('.jpg', ''));
  } catch {
    // public/recipes/ does not exist yet — no images downloaded
  }

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
          <RecipeFilterGrid recipes={recipes} slugsWithImages={slugsWithImages} />
        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add app/recipes/page.tsx
git commit -m "feat: pass slugsWithImages to RecipeFilterGrid from server component"
```

---

### Task 5: Build verification and push

- [ ] **Step 1: Run the production build**

```bash
npm run build 2>&1
```

Expected: `✓ Compiled successfully`, no TypeScript errors, all existing routes present.

If there are TypeScript errors, fix them before proceeding:
- Most likely cause: `RecipeFilterGrid` called without `slugsWithImages` prop somewhere — check `app/page.tsx` (homepage featured recipes) which uses a different pattern and is unaffected since it doesn't use `RecipeFilterGrid`.
- Second likely cause: `existsSync` import missing or wrong named import.

- [ ] **Step 2: Verify git is clean**

```bash
git status
```

Expected: clean (only untracked plan docs).

- [ ] **Step 3: Push to GitHub**

```bash
git push origin main
```

- [ ] **Step 4: Print run instructions**

After pushing, report these usage instructions for the user:

```
To download recipe images, run:

UNSPLASH_ACCESS_KEY=DLa5SRpUsI56m-jONw9yNCXX1006ud978byoBDfRA8w node scripts/download-recipe-images.js

Then rebuild to see images in the UI:
npm run build && npm start

Images are saved to public/recipes/{slug}.jpg
Re-running the script skips already-downloaded images.
```

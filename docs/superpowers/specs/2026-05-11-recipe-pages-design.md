# Recipe Pages Design Spec
**Date:** 2026-05-11  
**Project:** Joe's MealMap  
**Scope:** (1) Rename meal3→snack throughout MealMap.tsx + meals.ts, (2) Recipe index page `/recipes`, (3) Individual recipe pages `/recipes/[slug]`

---

## 1. Data Source

**Single source of truth:** `lib/recipes-merged.json` (100 recipes).

Fields available per recipe:
- `slug`, `name`, `type` (breakfast | lunch | dinner | meal3), `proto`
- `prepTime`, `cookTime`, `totalTime`, `servings`
- `cal`, `pro`, `carb`, `fat`, `cost`
- `description`, `photoSearch`
- `ingredients[]` — `{ item, quantity }`
- `steps[]` — `{ step, title, instruction }`
- `tips`

**Note:** `recipes-merged.json` currently uses `meal3` as the type for snack-category meals. As part of this work, we update those entries to `snack` for full consistency. Filter pill "Snacks" maps to `type === 'snack'`.

**Derived tag logic (computed at render, no new fields):**
- `isHighProtein`: `pro >= 30`
- `isVegetarian`: `proto` in `['yogurt', 'eggs', 'legumes', 'tofu']`
- `isVegan`: `proto` in `['legumes', 'tofu']`

---

## 2. MealMap.tsx + meals.ts Rename (meal3 → snack)

All occurrences of the string `'meal3'` and the label "Meal 3" are replaced with `'snack'` / "Snack".

**`lib/meals.ts`:**
- `MealType`: `'breakfast' | 'lunch' | 'dinner' | 'meal3'` → `'breakfast' | 'lunch' | 'dinner' | 'snack'`
- All meal entries with `type: 'meal3'` → `type: 'snack'`

**`components/MealMap.tsx`:**
- `TYPE_LABELS`: `meal3: '⚡ Meal 3 (lighter)'` → `snack: '⚡ Snack (lighter)'`
- `activeMealTypes`: `['lunch', 'dinner', 'meal3']` → `['lunch', 'dinner', 'snack']`
- Initial `picks` + `options` state: `{ breakfast:[], lunch:[], dinner:[], meal3:[] }` → `{ breakfast:[], lunch:[], dinner:[], snack:[] }`
- `handleResetEverything`: same state reset updated to `snack`
- IF banner text: "pick a Lunch, Dinner, and Meal 3 (lighter protein hit)" → "pick a Lunch, Dinner, and Snack (lighter protein hit)"
- `planData` in `handleSubmitEmail`: `TYPE_LABELS[type]` call already resolves correctly once TYPE_LABELS is updated
- `handleGenerate` and all other places that reference `meal3` as a string key

**`lib/meal-utils.ts`:**
- Line 36: `if (type === 'meal3')` → `if (type === 'snack')`

---

## 3. Architecture

```
lib/recipes-merged.json
  └── app/recipes/page.tsx                (Server Component — imports JSON, passes to client child)
        └── components/RecipeFilterGrid.tsx  ('use client' — search + filter state)
              └── renders recipe cards inline (no separate RecipeCard component needed)

  └── app/recipes/[slug]/page.tsx         (Server Component — generateStaticParams + generateMetadata)
```

**Why server component shell + client child:**  
Keeps the page statically renderable (good for SEO/metadata), while the filter/search interactivity lives in a single client component. No router.push needed — state lives in React, not URL.

---

## 4. Recipe Index Page (`/recipes`)

### Page structure
```
<NavBar />
<main class="recipes-page-main">
  <div class="section-inner">          {/* max-width 1100px, same as rest of site */}
    <header class="recipes-page-header">
      <span class="section-eyebrow">Recipe Index</span>
      <h1 class="section-title">100 meals. Built around your macros.</h1>
      <p class="section-sub">Browse all recipes, filter by type or goal, and click through for full ingredients and instructions.</p>
    </header>
    <RecipeFilterGrid recipes={recipes} />   {/* client component */}
  </div>
</main>
```

### RecipeFilterGrid internals
**State:**
- `activeFilter: string | null` — one of: `'breakfast' | 'lunch' | 'dinner' | 'meal3' | 'high-protein' | 'vegetarian' | 'vegan' | null`
- `search: string`

**Filter pills (7):** Breakfast, Lunch, Dinner, Snacks, High Protein, Vegetarian, Vegan  
Clicking an active pill deselects it (back to null). Filters compose with search (AND logic).

**Filter logic:**
```ts
const filtered = recipes.filter(r => {
  const matchesFilter = !activeFilter || (
    activeFilter === 'high-protein' ? r.pro >= 30 :
    activeFilter === 'vegetarian'   ? ['yogurt','eggs','legumes','tofu'].includes(r.proto) :
    activeFilter === 'vegan'        ? ['legumes','tofu'].includes(r.proto) :
    r.type === activeFilter         // breakfast | lunch | dinner | meal3
  );
  const matchesSearch = !search || r.name.toLowerCase().includes(search.toLowerCase());
  return matchesFilter && matchesSearch;
});
```

**Result count:** `Showing {filtered.length} of {recipes.length} recipes`

**Empty state:** Message + "Clear filters" button that resets both `activeFilter` and `search`.

### Recipe card anatomy
```
<Link href={`/recipes/${r.slug}`} class="recipe-card">
  <div class="recipe-card-img-wrap">
    {/* Placeholder: #f0ede6 bg, large proto emoji centered, meal name overlay at bottom */}
    <div class="recipe-card-img-placeholder">
      <span class="recipe-card-img-emoji">{PROTO_EMOJI[r.proto]}</span>
    </div>
    <div class="recipe-card-proto-tag" style={protoColor}>
      {proto label}
    </div>
    <div class="recipe-card-type-tag">
      {TYPE_LABEL[r.type]}   {/* Breakfast | Lunch | Dinner | Snack */}
    </div>
    <div class="recipe-card-name-overlay">
      {r.name}
    </div>
  </div>
  <div class="recipe-card-body">
    <p class="recipe-card-desc">{r.description}</p>
    <div class="recipe-card-macros">
      <span class="rcm rcm-cal">{r.cal} cal</span>
      <span class="rcm rcm-pro">{r.pro}g protein</span>
      <span class="rcm rcm-time">⏱ {r.totalTime} min</span>
      <span class="rcm rcm-cost">~${r.cost}</span>
    </div>
  </div>
</Link>
```

**Proto colors (same as home page):**
```ts
chicken: { bg:'#FFF3E0', text:'#E65100' }
beef:    { bg:'#FCE4EC', text:'#C62828' }
fish:    { bg:'#E3F2FD', text:'#1565C0' }
yogurt:  { bg:'#F3E5F5', text:'#6A1B9A' }
eggs:    { bg:'#FFFDE7', text:'#F57F17' }
pork:    { bg:'#FBE9E7', text:'#BF360C' }
legumes: { bg:'#E8F5E9', text:'#2E7D32' }
tofu:    { bg:'#E0F2F1', text:'#00695C' }
```

**Grid:** 3 columns desktop → 2 tablet (≤900px) → 1 mobile (≤560px). Uses existing `.recipe-grid` class.

---

## 5. Individual Recipe Page (`/recipes/[slug]`)

### Static generation
```ts
export async function generateStaticParams() {
  return recipes.map(r => ({ slug: r.slug }));
}

export async function generateMetadata({ params }) {
  const recipe = recipes.find(r => r.slug === params.slug);
  return {
    title: `${recipe.name} | Joe's MealMap`,
    description: recipe.description,
  };
}
```

### Page structure
```
<NavBar />
<main class="recipe-detail-main">
  <div class="section-inner">

    {/* Breadcrumb */}
    <nav class="breadcrumb">
      <Link href="/recipes">Recipes</Link> → {recipe.name}
    </nav>

    {/* Hero */}
    <div class="recipe-hero">
      <span class="recipe-hero-emoji">{PROTO_EMOJI[recipe.proto]}</span>
      <div class="recipe-hero-overlay">
        <span class="recipe-card-type-tag">{TYPE_LABEL[recipe.type]}</span>
        <h1 class="recipe-hero-name">{recipe.name}</h1>
      </div>
    </div>

    {/* Two-column layout */}
    <div class="recipe-detail-layout">

      {/* Left: Ingredients + Instructions */}
      <div class="recipe-detail-left">
        <section>
          <h2>Ingredients</h2>
          <ul class="recipe-ingredients-list">
            {ingredients.map(ing => (
              <li class="recipe-ingredient-row">
                <span class="ing-qty">{ing.quantity}</span>
                <span class="ing-name">{ing.item}</span>
                <a href={walmartUrl(ing.item)} class="walmart-link" target="_blank">🛒 Walmart</a>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Instructions</h2>
          <ol class="recipe-steps-list">
            {steps.map(s => (
              <li class="recipe-step">
                <strong class="step-title">{s.title}</strong>
                <p>{s.instruction}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* Right: Macros + Tips + CTA (sticky desktop) */}
      <aside class="recipe-detail-right">
        <div class="recipe-macro-card">
          <div class="stat-cell"><div class="stat-val">{recipe.cal}</div><div class="stat-lbl">Calories</div></div>
          <div class="stat-cell"><div class="stat-val">{recipe.pro}g</div><div class="stat-lbl">Protein</div></div>
          <div class="stat-cell"><div class="stat-val">{recipe.carb}g</div><div class="stat-lbl">Carbs</div></div>
          <div class="stat-cell"><div class="stat-val">{recipe.fat}g</div><div class="stat-lbl">Fat</div></div>
        </div>
        <div class="recipe-meta-row">
          <span>⏱ {recipe.totalTime} min</span>
          <span>· {recipe.servings} serving</span>
          <span>· ~${recipe.cost}</span>
        </div>
        {recipe.tips && (
          <blockquote class="recipe-tips">{recipe.tips}</blockquote>
        )}
        <Link href="/" class="btn-primary" style={{width:'100%', justifyContent:'center'}}>
          Add to meal plan →
        </Link>
      </aside>

    </div>
  </div>
</main>
```

**Walmart search URL:** `https://www.walmart.com/search?q=${encodeURIComponent(ing.item)}`

---

## 6. New CSS (added to globals.css)

All additions follow existing design system: no new colors, no gradients, only existing CSS variables.

```css
/* Recipe index page */
.recipes-page-main { background: #fafaf8; min-height: 100vh; padding-bottom: 80px; }
.recipes-page-header { padding: 60px 0 40px; text-align: center; }

.filter-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; justify-content: center; }
.filter-pill { padding: 8px 18px; font-size: 13px; font-weight: 500; font-family: DM Sans; border-radius: 99px; border: 1.5px solid var(--border-strong); background: var(--bg); color: var(--text-muted); cursor: pointer; transition: all 0.15s; }
.filter-pill:hover { border-color: #999; color: var(--text); }
.filter-pill.active { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }

.recipes-search { width: 100%; padding: 12px 16px; font-size: 14px; font-family: DM Sans; border: 1.5px solid var(--border-strong); border-radius: var(--radius-sm); background: var(--surface); color: var(--text); outline: none; margin-bottom: 10px; transition: border-color 0.15s; }
.recipes-search:focus { border-color: var(--text); }

.recipes-count { font-size: 12px; color: var(--text-muted); font-family: DM Mono, monospace; margin-bottom: 20px; }

.recipe-card-name-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 10px 14px; background: rgba(255,255,255,0.85); backdrop-filter: blur(4px); font-size: 13px; font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.rcm-cost { background: #f5f5f5; color: var(--text-muted); }

/* Recipe detail page */
.recipe-detail-main { background: #fafaf8; min-height: 100vh; padding-bottom: 80px; }

.breadcrumb { font-size: 13px; color: var(--text-muted); padding: 24px 0 16px; }
.breadcrumb a { color: var(--text-muted); text-decoration: none; }
.breadcrumb a:hover { color: var(--text); }

.recipe-hero { position: relative; height: 320px; border-radius: 20px; background: #f0ede6; overflow: hidden; display: flex; align-items: center; justify-content: center; margin-bottom: 36px; }
.recipe-hero-emoji { font-size: 96px; }
.recipe-hero-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 20px 28px; background: rgba(0,0,0,0.45); display: flex; flex-direction: column; gap: 6px; }
.recipe-hero-name { font-size: clamp(22px, 3vw, 32px); font-weight: 600; color: #fff; letter-spacing: -0.4px; line-height: 1.2; }

.recipe-detail-layout { display: grid; grid-template-columns: 1fr 340px; gap: 48px; align-items: start; }
.recipe-detail-right { position: sticky; top: 80px; display: flex; flex-direction: column; gap: 16px; }

.recipe-macro-card { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px; }

.recipe-detail-left h2 { font-size: 15px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-faint); margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid var(--border); }
.recipe-detail-left section { margin-bottom: 36px; }

.recipe-ingredient-row { display: flex; align-items: center; gap: 10px; padding: 9px 0; border-bottom: 1px solid var(--border); font-size: 14px; }
.recipe-ingredient-row:last-child { border-bottom: none; }
.ing-qty { font-family: DM Mono, monospace; font-size: 12px; color: var(--text-muted); min-width: 60px; flex-shrink: 0; }
.ing-name { flex: 1; color: var(--text); }

.recipe-step { margin-bottom: 20px; }
.recipe-step:last-child { margin-bottom: 0; }
.step-num-badge { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 99px; background: #1a1a1a; color: #fff; font-size: 11px; font-weight: 700; margin-bottom: 6px; flex-shrink: 0; }
.step-title { font-size: 14px; font-weight: 600; color: var(--text); display: block; margin-bottom: 4px; }
.step-body { font-size: 14px; color: var(--text-muted); line-height: 1.65; }

.recipe-tips { border-left: 3px solid #1a1a1a; padding: 4px 0 4px 18px; font-size: 14px; color: var(--text-muted); line-height: 1.65; font-style: italic; }
.recipe-meta-row { font-size: 13px; color: var(--text-muted); font-family: DM Mono, monospace; display: flex; gap: 8px; flex-wrap: wrap; }

/* Responsive */
@media (max-width: 860px) {
  .recipe-detail-layout { grid-template-columns: 1fr; }
  .recipe-detail-right { position: static; }
  .recipe-hero { height: 220px; }
  .recipe-hero-emoji { font-size: 64px; }
}
```

---

## 7. Files to Create / Modify

| Action | File |
|--------|------|
| Modify | `lib/meals.ts` — MealType + all meal3 entries |
| Modify | `lib/recipes-merged.json` — change all `"type": "meal3"` → `"type": "snack"` |
| Modify | `lib/meal-utils.ts` — `type === 'meal3'` check |
| Modify | `components/MealMap.tsx` — all meal3 references |
| Replace | `app/recipes/page.tsx` — full recipe index |
| Create | `components/RecipeFilterGrid.tsx` — client filter component |
| Create | `app/recipes/[slug]/page.tsx` — individual recipe page |
| Modify | `app/globals.css` — new CSS additions |
| Modify | `next.config.ts` — no changes needed (no external images) |

---

## 8. Out of Scope

- Real Unsplash images (deferred — placeholder system is the target state for now)
- URL-based filter state (shareable links) — not needed at this stage
- Pagination — 100 recipes renders fine in one grid
- Recipe ratings, comments, or user-generated content

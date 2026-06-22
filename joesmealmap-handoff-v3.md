# Joe's MealMap — Handoff Doc v3

## Live Product
- **URL:** joesmealmap.com
- **Stack:** Next.js 15 App Router, TypeScript, Vercel, Resend email, Supabase auth
- **GitHub:** github.com/joe189/joesmealmap
- **Local path:** /Users/josephjennings/Desktop/joesmealmap
- **Email:** plan@joesmealmap.com (Resend, domain verified)
- **Newsletter:** joesmealmap.beehiiv.com (pub ID: pub_cd6f3dab-c974-497c-9674-edce475ac7a9, v2 API)
- **Workflow:** Edit locally → git push → Vercel auto-deploys in ~60s

---

## Site Structure
```
joesmealmap.com/           → brand homepage (Joe's photo, story, CTAs + Beehiiv email signup)
joesmealmap.com/planner    → meal planner app
joesmealmap.com/recipes    → recipe index (search, filter, sort A-Z default)
joesmealmap.com/recipes/[slug] → individual recipe pages
joesmealmap.com/about      → Joe's story
joesmealmap.com/login      → login/signup page (email + Google OAuth)
joesmealmap.com/profile    → user profile (saved recipes, saved plans)
joesmealmap.com/sitemap.xml → auto-generated
joesmealmap.com/robots.txt → auto-generated
```

---

## Tech Stack
```
app/
  layout.tsx              global metadata, fonts
  page.tsx                brand homepage
  planner/page.tsx        meal planner app
  recipes/page.tsx        recipe index
  recipes/[slug]/         individual recipe pages
  about/page.tsx          about page
  login/page.tsx          login/signup (email + Google OAuth)
  profile/page.tsx        user profile page
  api/subscribe/route.ts  Beehiiv newsletter signup endpoint
  sitemap.ts              auto sitemap
  robots.ts               robots.txt
components/
  MealMap.tsx             full planner component
  RecipeFilterGrid.tsx    recipe index with search/filter/sort
  NavBar.tsx              site navigation (Sign In / My Account button)
  SubscribeForm.tsx       homepage email signup form
lib/
  meals-data.ts           SINGLE SOURCE OF TRUTH — 240 meals, all fields
  meal-utils.ts           mealOk(), dietaryOk(), buildVariedOptions()
  supabase.ts             Supabase client + save/unsave helpers
public/
  joe.webp                Joe's photo (transparent background)
  og-image.jpg            TODO: needs to be created (1200x630px)
  recipes/                recipe images named by slug e.g. grilled-chicken-rice-bowl.jpg
scripts/
  download-recipe-images.js   Unsplash image downloader
```

---

## Data Architecture
**One source of truth: `lib/meals-data.ts`**

Both the planner and recipe pages read from this file. Do not use meals.ts or recipes-merged.json — those are legacy backup files.

Each meal object has:
```typescript
{
  slug, name, type, proto,
  cal, pro, carb, fat, cost,
  desc, tags, shopping,        // planner fields
  ingredients, steps, tips,    // recipe page fields
  prepTime, cookTime, totalTime, servings,
  description, seoDescription, photoSearch
}
```

**Meal types:** breakfast | lunch | dinner | snack | dessert
**Proto types:** chicken | beef | pork | fish | eggs | legumes | yogurt | tofu

**Notes:**
- meal3 was renamed to snack throughout the entire codebase
- Desserts category added — recipe pages only, not in planner UI
- Desserts tab placed last in filter order on recipe index
- Proto badge on recipe pages shows "Desserts" for type === "dessert" instead of the proto value
- MealMap.tsx planner state includes dessert: [] as an inert key to satisfy TypeScript

---

## Current Recipe Count: 240
- 200 original recipes (breakfast / lunch / dinner / snack)
- 40 dessert recipes added (all type: "dessert", images downloaded from Unsplash)

Coverage gaps in non-dessert recipes:
- Snacks: almost all protos under 2 — biggest gap
- Breakfast: chicken(3), beef(2), pork(2), fish(3), legumes(4), tofu(2)
- Lunch: eggs(1), yogurt(1), tofu(2), pork(3), legumes(6)
- Dinner: yogurt(0), eggs(1), legumes(2), tofu(3), pork(6), fish(6)

Target: 10 recipes per proto per meal type.

---

## Auth & User Accounts (Supabase)
- **Project ID:** sdmrsqenqghglalwbskd
- **URL:** https://sdmrsqenqghglalwbskd.supabase.co
- **Auth methods:** Email/password + Google OAuth
- **Google OAuth:** configured via Google Cloud Console, client ID/secret in Supabase
- **Confirmation emails:** sent via Resend SMTP (smtp.resend.com:465)
- **Redirect URLs registered:** https://www.joesmealmap.com, https://www.joesmealmap.com/auth/callback, http://localhost:3000/auth/callback

**Database tables:**
```sql
saved_recipes (id, user_id, slug, created_at)         -- RLS enabled
saved_plans   (id, user_id, plan jsonb, created_at)   -- RLS enabled
```
Both tables have row-level security policies so users can only access their own data.

**Profile page** (`app/profile/page.tsx`):
- Shows saved recipes grid (photo, name, calories) — links to recipe pages
- Shows saved plans list with expand/collapse
- Placeholder avatar with user initial, email display, greyed-out Edit Profile button
- Redirects to /login if not authenticated
- force-dynamic to prevent prerender errors

---

## Planner Features
- Daily macro targets with auto-calorie calculation
- Grams/% toggle
- Goal-based macro calculator (6 presets)
- 8 protein source toggles (3-state: neutral/selected/excluded)
- Dietary preferences: Vegetarian, Vegan, No dairy/gluten/pork/seafood/eggs/nuts
- Skip breakfast toggle (IF mode) → shows Lunch + Dinner + Snack
- Generate shows 7 options per meal type filtered by protein prefs
- Variety algorithm guarantees at least 1 option per selected protein
- Pick UP TO 3 from each category (not mandatory — can confirm with fewer) — PENDING
- Lock/refresh system — selected meals stay locked on refresh
- Confirm builds full week plan
- Save Plan button → saves to saved_plans table (requires login)
- Shopping list grouped by Meat/Produce/Dairy/Pantry
- Real US purchase quantities
- Cart + "Already Have" checkboxes
- Walmart search links on every ingredient
- Print shopping list only
- Email plan via Resend

---

## Beehiiv Email Signup
- Wired via server-side route: `app/api/subscribe/route.ts`
- Uses v2 API with publication ID
- `SubscribeForm.tsx` client component with loading/success/error states
- Env vars: BEEHIIV_API_KEY, BEEHIIV_PUBLICATION_ID (both in Vercel + .env.local)

---

## Pending Features (build next)
1. **Pick up to 3** — change confirm button to enable with 1+ picks per category, not exactly 3
2. **Add to planner fix** — recipe pages "Add to meal plan" should pass slug as URL param `/planner?add=slug` and pre-select that meal
3. **OG image** — create 1200x630px branded image for social sharing, save to public/og-image.jpg
4. **Fix worst recipe images** — manually swap ~15 bad Unsplash images
5. **Profile page — Edit Profile** — photo upload, display name, social links
6. **Programmatic SEO category pages** — /high-protein-breakfasts, /meal-prep-recipes etc.
7. **Proto tag data audit** — some recipes have incorrect proto values (e.g. apple-cinnamon-protein-waffles tagged as eggs)

---

## Environment Variables (Vercel Production)
- RESEND_API_KEY
- RESEND_FROM_EMAIL = plan@joesmealmap.com
- NEXT_PUBLIC_SUPABASE_URL = https://sdmrsqenqghglalwbskd.supabase.co
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- BEEHIIV_API_KEY
- BEEHIIV_PUBLICATION_ID

---

## Affiliates
- Impact.com — verified ✅
- Walmart — applied ✅
- Instacart — applied ✅
- HelloFresh — applied ✅
- Shipt — apply on Impact
- Amazon Associates — applied ✅
- Thrive Market — later (requires social content)

---

## Design System
- Background: #FAFAFA
- Cards: #FFFFFF
- Primary text: #111111
- Secondary text: #6B7280
- Muted: #9CA3AF
- Primary green: #22C55E
- Hover green: #16A34A
- Light green bg: #DCFCE7
- Dark green text: #166534
- Borders: #E5E7EB
- Border radius: 12px
- Fonts: DM Sans (primary), DM Mono (numbers/data)
- No gradients, no extra colors outside green system
- Let food images provide color
- Inline styles only (no CSS classes) — matches existing codebase pattern

---

## Brand
**Joe's story:** "I wanted a simple way to shop every week and hit my diet and fitness goals. I didn't find anything that was doing it so I built the tool for myself and realized it might help others — plus I'm a secret fat kid with a passion for good food. I believe your diet doesn't have to be stale, boring, and repetitive just because you want to look good."

**Joe's photo:** joe.webp in public folder (transparent background, arms crossed on chair)

---

## Adding New Recipes
1. Generate in ChatGPT using full field schema
2. Save as new-recipes.json in project root
3. Tell Claude Code to merge new-recipes.json into lib/meals-data.ts (it will remap field names if needed: calories→cal, protein→pro, carbs→carb)
4. Run image script: `UNSPLASH_ACCESS_KEY=key node scripts/download-recipe-images.js`
5. git add . && git commit -m "Add X recipes" && git push

**Required fields for new recipes:**
slug, name, type, proto, cal, pro, carb, fat, cost, desc, tags, shopping, ingredients, steps, tips, prepTime, cookTime, totalTime, servings, description, seoDescription, photoSearch

---

## SEO Status
- Google Search Console verified (domain method)
- Sitemap submitted: joesmealmap.com/sitemap.xml
- robots.txt live
- JSON-LD Recipe schema on all recipe pages
- OG tags configured (needs og-image.jpg)
- Canonical URLs set on all pages
- Breadcrumb schema on recipe pages
- Related recipes on recipe pages

---

## Monetization Plan
- Affiliate links: Walmart (shopping list), Instacart, HelloFresh, Amazon
- Display ads: Apply Google AdSense now, upgrade to Mediavine at 50k sessions
- Recipe SEO: 240 pages indexed, growing to 500+
- Email list: Beehiiv newsletter
- Future: Premium tier ($5-8/month)

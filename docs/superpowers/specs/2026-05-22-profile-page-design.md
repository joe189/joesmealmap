# Profile Page Design

**Date:** 2026-05-22
**File:** `app/profile/page.tsx`
**Approach:** Single `'use client'` component with inline styles (Option A)

---

## Overview

A profile page for authenticated users showing their account info, saved recipes, and saved meal plans. Unauthenticated users are redirected to `/login`. Matches existing design patterns from `login/page.tsx` and `NavBar.tsx`.

---

## Architecture

Single file: `app/profile/page.tsx`

- `'use client'` directive + `export const dynamic = "force-dynamic"` at the top
- Auth check in `useEffect` via `supabase.auth.getUser()` → redirect to `/login` with `router.replace` if no user
- Data fetch in a second `useEffect` (dependent on user) → parallel fetch of `saved_recipes` and `saved_plans` from Supabase
- Recipe name/cal resolved by looking up slug in the `MEALS` array from `lib/meals-data`
- No new files, no new patterns introduced

---

## Data Model

**`saved_recipes` table**
- Columns used: `slug`
- Name and calories resolved client-side from `MEALS[]` by slug match
- Missing slugs (deleted recipes) are skipped silently

**`saved_plans` table**
- Columns used: `plan_data` (JSONB), `id`
- `plan_data.savedAt` — ISO timestamp used as display date
- `plan_data.picks` — `Record<MealType, { name, slug, cal, pro, carb, fat, cost }[]>`

---

## Page Layout

### Header section
- 64×64px circular avatar: green (`#22C55E`) background, white initial from email
- Email address: 18px, weight 600, `#1a1a1a`
- "Edit Profile" button: same style as navbar auth button (`border: 1.5px solid #E5E7EB`, white bg) but `opacity: 0.4`, `cursor: not-allowed` — not wired up yet

### Saved Recipes section
- Section heading "Saved Recipes" + count badge
- 3-column grid (responsive: 2-column below 640px, 1-column below 400px)
- Each card:
  - Image: `/recipes/[slug].jpg` with an emoji fallback (`🍴`) if the file is absent
  - Recipe name: 14px semibold, `#1a1a1a`
  - Calorie badge: `{cal} cal`, styled like `.rcm-cal` (amber pill)
  - Full card is a `Link` to `/recipes/[slug]`
  - Card: white bg, `border: 1px solid rgba(0,0,0,0.08)`, `borderRadius: 12px`, `boxShadow: var(--shadow)`
- Empty state: "No saved recipes yet." + link to `/recipes`

### Saved Plans section
- Section heading "Saved Plans" + count badge
- Vertical list of plan cards
- Each card:
  - Left: formatted date from `plan_data.savedAt` (e.g., "May 21, 2026")
  - Right: expand/collapse chevron button
  - Expanded: meal type rows (Breakfast / Lunch / Dinner / Snack) each showing meal names + `{cal} cal` inline, separated by a light border
- Empty state: "No saved plans yet." + link to `/planner`

### Loading state
- While auth/data is resolving: simple centered spinner or skeleton (`Loading…` text is acceptable)

---

## Design Tokens

Consistent with existing codebase:
- Background: `#f7f6f2` (CSS var `--bg`)
- Card background: `#fff`
- Card border: `rgba(0,0,0,0.08)`
- Card border-radius: `12px`
- Card shadow: `0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)`
- Green accent: `#22C55E`
- Text primary: `#1a1a1a`
- Text muted: `#888`
- Font: `'DM Sans', sans-serif`

---

## Error Handling

- Auth failure → redirect to `/login`
- Supabase fetch error → show "Could not load data" message (non-fatal, page still renders)
- Recipe slug not found in `MEALS` → skip that card silently

---

## Out of Scope

- "Edit Profile" functionality
- Unsave / delete recipes or plans from this page
- Pagination

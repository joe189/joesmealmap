# Blog Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete blog section with index, post pages, MDX rendering, JSON-LD, related recipes, nav link, sitemap, and a homepage "From the Blog" teaser.

**Architecture:** Blog posts live as MDX files in `content/blog/`. A utility (`lib/blog.ts`) reads them with `fs` + `gray-matter` for the index and metadata. Post pages render MDX body with `compileMDX` from `next-mdx-remote/rsc`. All pages are statically generated at build time — no runtime reads. The blog index and post grid reuse existing `.recipe-grid` / `.recipe-card` CSS classes; prose body gets a new `.blog-prose` block in globals.css.

**Tech Stack:** Next.js 15 App Router (server components), `gray-matter`, `next-mdx-remote`, TypeScript, existing globals.css design system.

## Global Constraints

- Follow existing inline style pattern — no new CSS files, only additions to `app/globals.css`
- All colors must be from the existing design system: `#22C55E` (green links/accents), `#DCFCE7` / `#166534` (tags), `var(--text)`, `var(--text-muted)`, `var(--border)`, `#1a1a1a`, `#fafaf8`, `#fff`
- `BASE_URL = 'https://www.joesmealmap.com'`
- Next.js 15: `params` must be typed as `Promise<{ slug: string }>` and awaited before use
- `export const dynamicParams = false` on the post page
- `rel="sponsored nofollow"` on any Amazon/affiliate links inside MDX
- Blog post reading time calculated as `Math.ceil(wordCount / 200)` minutes
- Amazon links in MDX body are plain markdown links — the MDXRemote renderer does not auto-add rel attributes; only links that are explicitly Amazon affiliate links need `rel="sponsored nofollow"` and those go in the MDX source itself

---

### Task 1: Install dependencies, create `lib/blog.ts`, add CSS

**Files:**
- Modify: `package.json` (via npm install)
- Create: `lib/blog.ts`
- Modify: `app/globals.css` (append blog card + prose CSS)

**Interfaces:**
- Produces:
  - `BlogPost` type: `{ slug, title, description, date, coverImage, tags }`
  - `getAllPosts(): BlogPost[]` — all posts sorted newest first
  - `getPostBySlug(slug: string): { frontmatter: BlogPost; content: string } | null`
  - `.blog-card`, `.blog-card-img-wrap`, `.blog-card-body`, `.blog-card-date`, `.blog-card-tags`, `.blog-card-tag`, `.blog-card-title`, `.blog-card-desc`, `.blog-card-link` CSS classes
  - `.blog-prose` CSS class (styles rendered MDX body)

- [ ] **Step 1: Install gray-matter and next-mdx-remote**

```bash
npm install gray-matter next-mdx-remote
```

Expected: packages added to node_modules, package.json updated.

- [ ] **Step 2: Create `lib/blog.ts`**

```ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  coverImage: string;
  tags: string[];
};

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  return fs
    .readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.mdx'))
    .map(filename => {
      const slug = filename.replace(/\.mdx$/, '');
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8');
      const { data } = matter(raw);
      return {
        slug: data.slug ?? slug,
        title: data.title ?? slug,
        description: data.description ?? '',
        date: data.date ?? '',
        coverImage: data.coverImage ?? '',
        tags: data.tags ?? [],
      } satisfies BlogPost;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): { frontmatter: BlogPost; content: string } | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    frontmatter: {
      slug: data.slug ?? slug,
      title: data.title ?? slug,
      description: data.description ?? '',
      date: data.date ?? '',
      coverImage: data.coverImage ?? '',
      tags: data.tags ?? [],
    },
    content,
  };
}
```

- [ ] **Step 3: Add blog CSS to `app/globals.css`**

Append this block at the very end of `app/globals.css`:

```css
/* ═══════════════════════════════════════════════════════
   BLOG
════════════════════════════════════════════════════════ */
.blog-card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s, transform 0.2s;
}
.blog-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.09); transform: translateY(-2px); }
.blog-card-img-wrap { position: relative; aspect-ratio: 16/9; overflow: hidden; background: #f0ede6; }
.blog-card-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.blog-card-body { padding: 20px; flex: 1; display: flex; flex-direction: column; gap: 10px; }
.blog-card-date { font-family: var(--font-dm-mono), 'DM Mono', monospace; font-size: 11px; color: var(--text-muted); }
.blog-card-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.blog-card-tag { background: #DCFCE7; color: #166534; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 99px; text-transform: capitalize; }
.blog-card-title { font-size: 16px; font-weight: 600; line-height: 1.35; color: var(--text); }
.blog-card-desc { font-size: 13px; color: var(--text-muted); line-height: 1.55; flex: 1; }
.blog-card-link { font-size: 13px; font-weight: 600; color: #22C55E; text-decoration: none; margin-top: auto; }

/* Blog prose — wraps rendered MDX body */
.blog-prose { font-family: var(--font-dm-sans), 'DM Sans', sans-serif; font-size: 17px; line-height: 1.78; color: var(--text); }
.blog-prose h2 { font-size: 22px; font-weight: 700; line-height: 1.3; margin: 2em 0 0.5em; color: var(--text); border-bottom: 1px solid var(--border); padding-bottom: 8px; }
.blog-prose h3 { font-size: 18px; font-weight: 700; line-height: 1.35; margin: 1.75em 0 0.4em; color: var(--text); }
.blog-prose p { margin: 0.9em 0; }
.blog-prose a { color: #22C55E; text-decoration: underline; text-underline-offset: 3px; }
.blog-prose a:hover { color: #16a34a; }
.blog-prose strong { font-weight: 700; }
.blog-prose em { font-style: italic; }
.blog-prose ul { list-style: disc; padding-left: 1.5em; margin: 0.9em 0; display: flex; flex-direction: column; gap: 4px; }
.blog-prose ol { list-style: decimal; padding-left: 1.5em; margin: 0.9em 0; display: flex; flex-direction: column; gap: 4px; }
.blog-prose li { line-height: 1.65; }
.blog-prose blockquote { border-left: 3px solid #22C55E; padding-left: 1em; color: var(--text-muted); font-style: italic; margin: 1.5em 0; }
.blog-prose table { width: 100%; border-collapse: collapse; margin: 1.5em 0; font-size: 14px; }
.blog-prose th { background: #f5f5f5; padding: 10px 14px; text-align: left; font-weight: 600; border: 1px solid var(--border); }
.blog-prose td { padding: 10px 14px; border: 1px solid var(--border); }
.blog-prose code { font-family: var(--font-dm-mono), 'DM Mono', monospace; font-size: 14px; background: #f5f5f5; padding: 2px 6px; border-radius: 4px; }
.blog-prose hr { border: none; border-top: 1px solid var(--border); margin: 2.5em 0; }
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add lib/blog.ts app/globals.css package.json package-lock.json
git commit -m "feat: install gray-matter/next-mdx-remote, add lib/blog.ts and blog CSS"
```

---

### Task 2: Create the sample MDX post

**Files:**
- Create: `content/blog/how-to-hit-50g-protein-at-breakfast.mdx`

**Interfaces:**
- Consumes: nothing
- Produces: a parseable MDX file with valid frontmatter that `getAllPosts()` and `getPostBySlug()` can read

- [ ] **Step 1: Create `content/blog/` directory and the MDX file**

Create `content/blog/how-to-hit-50g-protein-at-breakfast.mdx` with this exact content:

```mdx
---
title: "How to Hit 50g of Protein at Breakfast (Without Eating Boring Food)"
description: "Most people get 10-15g of protein at breakfast. Here's how to triple that with food you'll actually want to eat."
date: "2026-06-24"
slug: "how-to-hit-50g-protein-at-breakfast"
coverImage: "/recipes/greek-yogurt-berry-bowl.jpg"
tags: ["breakfast", "protein"]
---

Most people eat breakfast and barely crack 15g of protein. Then they wonder why they're hungry by 10am and can't seem to make progress in the gym. This post is about fixing that — specifically, hitting 50g of protein before noon without drinking raw eggs or eating sad plain chicken breast.

50g sounds like a lot. Once you understand what you're building with, it's actually very doable on a normal morning.

## Why Breakfast Protein Actually Matters

When you wake up, your body has been fasting for 7–9 hours. Muscle protein synthesis — the process your body uses to build and maintain muscle — slows significantly overnight. To kick it back into gear, you need dietary protein, specifically enough leucine to trigger a meaningful anabolic response.

Research consistently shows that 40g+ of protein at breakfast produces a stronger muscle-building signal than spreading the same amount in smaller doses across more meals. Breakfast isn't just about not being hungry — it might be the most important protein opportunity of your day.

The other reason to front-load protein: satiety. High protein breakfasts suppress ghrelin (your hunger hormone) for hours. If you're fighting cravings by mid-morning, a 15g breakfast is almost certainly part of the problem.

## The Building Blocks: What Actually Has Protein

Before we get into formulas, here's what you're working with. These are the protein workhorses of any solid breakfast:

**Animal proteins (per typical serving):**
- Eggs (3 large): 18g protein
- Greek yogurt (1 cup, plain): 17–20g protein
- Ground turkey (3 oz cooked): 21g protein
- Deli turkey (3 slices): 12g protein
- Cottage cheese (½ cup): 14g protein
- Turkey sausage (2 links): 14g protein

**Add-ons that meaningfully boost the total:**
- Protein powder (1 scoop): 20–25g
- Shredded cheddar (¼ cup): 7g
- Whole milk (1 cup): 8g
- Hemp seeds (3 tbsp): 10g

The key insight here: no single "normal" breakfast food gets you to 50g alone. You need to deliberately layer 2–3 protein sources. Once you start thinking in combinations instead of individual ingredients, 50g becomes a system — not a challenge.

## Three Formulas That Hit 50g

### Formula 1: The Egg + Turkey Stack

The most straightforward route. Three scrambled eggs (18g) plus 3 oz of cooked ground turkey (21g) plus a quarter cup of shredded cheese (7g) gets you to 46g before you touch anything else. Add two slices of deli turkey on the side and you're at 58g.

The [Scrambled Eggs & Turkey](/recipes/scrambled-eggs-turkey) recipe on this site is built around this exact formula. It comes in at 36g per serving — to push it to 50g, add another egg and an extra ounce of turkey. Takes the same amount of time and barely changes the recipe.

This formula works especially well for people who meal prep. Cook a pound of ground turkey on Sunday, portion it into 3 oz servings, and your 50g breakfast assembly time is under 5 minutes every morning.

### Formula 2: The Greek Yogurt Power Bowl

Greek yogurt is one of the most underrated protein sources on the planet. A cup of plain full-fat gives you 17–20g, and it's completely passive — scoop it in a bowl and you're already a third of the way there.

Layer in a scoop of protein powder mixed directly into the yogurt (another 20–25g) before you add your toppings, and you're at 40–45g without cooking anything. A tablespoon of hemp seeds brings it to 50g+.

The [Greek Yogurt & Berry Bowl](/recipes/greek-yogurt-berry-bowl) is a great base to build from. The version on this site hits 32g — to get to 50g, stir a scoop of vanilla protein powder into the yogurt before topping it. The texture actually gets creamier and the flavor barely changes.

### Formula 3: The Cottage Cheese Base

Cottage cheese is having a well-deserved comeback. Half a cup gives you 14g protein with almost no carbs and a mild flavor that works savory or sweet.

**Savory version:** ½ cup cottage cheese + 3 scrambled eggs + 2 turkey sausage links = ~52g protein, roughly 440 calories. Season the eggs with salt, black pepper, and garlic powder and it's legitimately good.

**Sweet version:** 1 cup cottage cheese + 1 scoop vanilla protein powder + ½ cup berries + 1 tbsp almond butter = ~50g protein. Blend it if you want a smoother texture. It tastes like dessert and takes 90 seconds to make.

## Common Mistakes That Kill Your Breakfast Protein

**Mistake 1: Relying on a single protein source.**
A bowl of Greek yogurt is 17g. That's a good snack, not a 50g breakfast. You need to layer intentionally.

**Mistake 2: Underestimating eggs.**
Two eggs is only 12g. Three eggs gets you to 18g. A lot of people think their "egg breakfast" is high protein — then check the math and realize they're at 15g total. You need either 4–5 eggs or a significant secondary protein source.

**Mistake 3: Overcomplicating the prep.**
The best high-protein breakfast is the one you'll actually make under time pressure. Batch cook your meat source Sunday night. Keep Greek yogurt and cottage cheese stocked. Design for 5-minute assembly, not 25-minute cooking sessions.

**Mistake 4: Skipping it because you're not hungry.**
Morning appetite is partly habitual. If you're consistently not hungry in the morning, a liquid option works just as well: a protein shake made with 1 cup milk (8g) plus 2 scoops protein powder (40–50g) gets you to 48–58g without eating a full meal. Use that alongside a cup of Greek yogurt if you need the extra push.

## Quick Reference: 50g Combos That Work

| Combo | Approx. Protein |
|---|---|
| 3 eggs + 3oz ground turkey + ¼ cup cheese | ~47g |
| 1 cup Greek yogurt + 1 scoop protein powder + 3 tbsp hemp seeds | ~52g |
| ½ cup cottage cheese + 3 eggs + 2 turkey sausage links | ~52g |
| 1 cup milk protein shake (2 scoops) + 1 cup Greek yogurt | ~57g |
| 4 eggs scrambled + 3 slices deli turkey + ¼ cup cottage cheese | ~50g |

---

## FAQ

**Do I need to hit exactly 50g?**

No. 50g is a useful target, not a law. What matters is total daily protein (aim for 0.7–1g per pound of bodyweight) and not letting breakfast be a throwaway 10g meal. Consistently hitting 35–40g at breakfast puts you in a great position for the rest of the day.

**Won't all that protein at once be wasted?**

This is a myth. Your body doesn't "waste" protein past a 30g ceiling — that claim was based on flawed early research and has been substantially revised. High protein meals slow gastric emptying and your body processes what it needs over a longer window. You're fine.

**What if I don't have time to cook?**

Batch cook once a week. Ground turkey, turkey sausage, and hard boiled eggs all keep well for 4–5 days in the fridge. Combine those with Greek yogurt and cottage cheese — which require zero cooking — and most of your 50g breakfast options become grab-and-assemble, not cook-from-scratch.

**Is this approach good for weight loss?**

Yes. High protein eating is one of the most evidence-backed strategies for fat loss specifically because it preserves muscle while you're in a calorie deficit. The satiety benefit also makes it easier to maintain the deficit without feeling miserable. A 50g protein breakfast at 400–500 calories leaves you full, fueled, and on track.
```

- [ ] **Step 2: Verify gray-matter can parse the file**

```bash
node -e "const matter = require('gray-matter'); const fs = require('fs'); const {data} = matter(fs.readFileSync('content/blog/how-to-hit-50g-protein-at-breakfast.mdx','utf-8')); console.log(data);"
```

Expected output (approximately):
```
{
  title: 'How to Hit 50g of Protein at Breakfast (Without Eating Boring Food)',
  description: "Most people get 10-15g ...",
  date: '2026-06-24',
  slug: 'how-to-hit-50g-protein-at-breakfast',
  coverImage: '/recipes/greek-yogurt-berry-bowl.jpg',
  tags: [ 'breakfast', 'protein' ]
}
```

- [ ] **Step 3: Commit**

```bash
git add content/blog/
git commit -m "feat: add first blog post — how to hit 50g protein at breakfast"
```

---

### Task 3: Create `app/blog/page.tsx` (blog index)

**Files:**
- Create: `app/blog/page.tsx`

**Interfaces:**
- Consumes: `getAllPosts()`, `BlogPost` from `lib/blog.ts`
- Produces: static blog index page at `/blog`

- [ ] **Step 1: Create `app/blog/page.tsx`**

```tsx
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import { getAllPosts } from '@/lib/blog';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "The Joe's MealMap Blog",
  description: 'Meal prep tips, macro guides, and recipes worth making.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: "The Joe's MealMap Blog",
    description: 'Meal prep tips, macro guides, and recipes worth making.',
    url: 'https://www.joesmealmap.com/blog',
    type: 'website',
  },
};

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(
    new Date(dateStr + 'T12:00:00'),
  );
}

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
      <NavBar />
      <main className="recipes-page-main">
        <div className="section-inner">
          <header className="recipes-page-header">
            <span className="section-eyebrow">From Joe&apos;s kitchen</span>
            <h1 className="section-title">The Joe&apos;s MealMap Blog</h1>
            <p className="section-sub">
              Meal prep tips, macro guides, and recipes worth making.
            </p>
          </header>

          {posts.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px 0' }}>
              No posts yet — check back soon.
            </p>
          ) : (
            <div className="recipe-grid">
              {posts.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card">
                  <div className="blog-card-img-wrap">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="blog-card-img"
                      />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                        <span style={{ fontSize: '48px' }}>📝</span>
                      </div>
                    )}
                  </div>
                  <div className="blog-card-body">
                    <p className="blog-card-date">{formatDate(post.date)}</p>
                    {post.tags.length > 0 && (
                      <div className="blog-card-tags">
                        {post.tags.map(tag => (
                          <span key={tag} className="blog-card-tag">{tag}</span>
                        ))}
                      </div>
                    )}
                    <h2 className="blog-card-title">{post.title}</h2>
                    <p className="blog-card-desc">{post.description}</p>
                    <span className="blog-card-link">Read more →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 2: Build to verify the page generates**

```bash
npm run build 2>&1 | grep -E "blog|error|Error|✓" | head -20
```

Expected: `○ /blog` appears in route list, no errors.

- [ ] **Step 3: Commit**

```bash
git add app/blog/page.tsx
git commit -m "feat: add blog index page at /blog"
```

---

### Task 4: Create `app/blog/[slug]/page.tsx` (blog post page)

**Files:**
- Create: `app/blog/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getPostBySlug()`, `getAllPosts()` from `lib/blog.ts`; `compileMDX` from `next-mdx-remote/rsc`; `MEALS` from `lib/meals-data.ts`
- Produces: static blog post pages at `/blog/[slug]` with JSON-LD, related recipes section

- [ ] **Step 1: Create `app/blog/[slug]/page.tsx`**

```tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import NavBar from '@/components/NavBar';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { MEALS, type MealData } from '@/lib/meals-data';
import type { Metadata } from 'next';

export const dynamicParams = false;

const BASE_URL = 'https://www.joesmealmap.com';

const PROTO_EMOJI: Record<string, string> = {
  chicken: '🍗', beef: '🥩', fish: '🐟', yogurt: '🥛',
  eggs: '🥚', pork: '🐷', legumes: '🫘', tofu: '🌱',
};

const TYPE_LABEL: Record<string, string> = {
  breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack', dessert: 'Dessert',
};

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(
    new Date(dateStr + 'T12:00:00'),
  );
}

function getRelatedRecipes(postTags: string[]): { recipes: MealData[]; usedFallback: boolean } {
  const matched = MEALS.filter(r =>
    postTags.some(tag => r.type === tag || r.tags.includes(tag)),
  ).sort((a, b) => b.pro - a.pro);

  if (matched.length >= 3) {
    return { recipes: matched.slice(0, 3), usedFallback: false };
  }

  const matchedSlugs = new Set(matched.map(r => r.slug));
  const fillers = MEALS
    .filter(r => !matchedSlugs.has(r.slug))
    .sort((a, b) => b.pro - a.pro)
    .slice(0, 3 - matched.length);

  return { recipes: [...matched, ...fillers], usedFallback: fillers.length > 0 };
}

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const { frontmatter: fm } = post;
  return {
    title: fm.title,
    description: fm.description,
    alternates: { canonical: `/blog/${fm.slug}` },
    openGraph: {
      title: fm.title,
      description: fm.description,
      url: `${BASE_URL}/blog/${fm.slug}`,
      type: 'article',
      publishedTime: fm.date,
      images: fm.coverImage
        ? [{ url: fm.coverImage.startsWith('http') ? fm.coverImage : `${BASE_URL}${fm.coverImage}`, width: 1200, height: 630, alt: fm.title }]
        : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { frontmatter: fm, content: rawContent } = post;

  const { content } = await compileMDX({
    source: rawContent,
    options: { mdxOptions: { format: 'mdx' } },
  });

  const wordCount = rawContent.split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const { recipes: relatedRecipes, usedFallback } = getRelatedRecipes(fm.tags);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: fm.title,
    description: fm.description,
    image: fm.coverImage ? `${BASE_URL}${fm.coverImage}` : undefined,
    datePublished: fm.date,
    timeRequired: `PT${readingMinutes}M`,
    keywords: fm.tags.join(', '),
    author: {
      '@type': 'Person',
      name: 'Joe Jennings',
      url: `${BASE_URL}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: "Joe's MealMap",
      url: BASE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blog/${fm.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NavBar />
      <main style={{ background: '#fafaf8', minHeight: '100vh', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px' }}>

          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link> →{' '}
            <Link href="/blog">Blog</Link> →{' '}
            {fm.title}
          </nav>

          {/* Cover image */}
          {fm.coverImage && (
            <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '36px', aspectRatio: '16/9' }}>
              <img
                src={fm.coverImage}
                alt={fm.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          )}

          {/* Post header */}
          <header style={{ marginBottom: '40px' }}>
            {fm.tags.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {fm.tags.map(tag => (
                  <span
                    key={tag}
                    style={{ background: '#DCFCE7', color: '#166534', fontSize: '12px', fontWeight: 600, padding: '4px 12px', borderRadius: '99px', textTransform: 'capitalize' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <h1 style={{
              fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif',
              fontSize: 'clamp(26px, 4vw, 38px)',
              fontWeight: 700,
              lineHeight: 1.18,
              letterSpacing: '-0.4px',
              color: 'var(--text)',
              marginBottom: '16px',
            }}>
              {fm.title}
            </h1>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              <span style={{ fontFamily: 'var(--font-dm-mono), DM Mono, monospace' }}>
                {formatDate(fm.date)}
              </span>
              <span>·</span>
              <span>{readingMinutes} min read</span>
            </div>
          </header>

          {/* MDX body */}
          <article className="blog-prose">
            {content}
          </article>

          {/* Related recipes */}
          {relatedRecipes.length > 0 && (
            <section style={{ marginTop: '64px', paddingTop: '48px', borderTop: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', color: 'var(--text)' }}>
                {usedFallback ? "Joe's Top High-Protein Picks" : 'Related Recipes'}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {relatedRecipes.map(r => (
                  <Link
                    key={r.slug}
                    href={`/recipes/${r.slug}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '14px',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      color: 'inherit',
                      background: '#fff',
                      transition: 'box-shadow 0.2s',
                    }}
                  >
                    <span style={{ fontSize: '32px', lineHeight: 1 }}>{PROTO_EMOJI[r.proto] ?? '🍴'}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px', color: 'var(--text)' }}>
                        {r.name}
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                        {TYPE_LABEL[r.type] ?? r.type} · {r.cal} cal · {r.pro}g protein
                      </p>
                    </div>
                    <span style={{ fontSize: '13px', color: '#22C55E', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      View recipe →
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Back to blog */}
          <div style={{ marginTop: '48px', textAlign: 'center' }}>
            <Link href="/blog" className="btn-secondary">← Back to Blog</Link>
          </div>

        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 2: Build to verify post page generates**

```bash
npm run build 2>&1 | grep -E "blog|error|Error|✓" | head -30
```

Expected: `● /blog/[slug]` and `/blog/how-to-hit-50g-protein-at-breakfast` appear in route list, no errors.

- [ ] **Step 3: Commit**

```bash
git add app/blog/
git commit -m "feat: add blog post page with MDX rendering, JSON-LD, and related recipes"
```

---

### Task 5: NavBar Blog link + sitemap + homepage "From the Blog"

**Files:**
- Modify: `components/NavBar.tsx` — add Blog link between Recipes and About
- Modify: `app/sitemap.ts` — add /blog index + all post URLs
- Modify: `app/page.tsx` — add "From the Blog" section above email signup

**Interfaces:**
- Consumes: `getAllPosts()` from `lib/blog.ts`

- [ ] **Step 1: Add Blog link to `components/NavBar.tsx`**

In the desktop `site-nav-links` div, add after the Recipes link and before About:

```tsx
<Link href="/blog" className={`site-nav-link${pathname?.startsWith('/blog') ? ' active' : ''}`}>
  Blog
</Link>
```

In the mobile `mobile-menu-dropdown`, add after the Recipes link and before About:

```tsx
<Link href="/blog" className={pathname?.startsWith('/blog') ? 'active' : ''}>Blog</Link>
```

Full updated NavBar (show only the changed sections — apply both edits):

Desktop links block (lines 107–124 in NavBar.tsx) becomes:
```tsx
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
```

Mobile dropdown (lines 140–150) becomes:
```tsx
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
```

- [ ] **Step 2: Update `app/sitemap.ts`**

Replace the full file with:

```ts
import type { MetadataRoute } from 'next';
import { MEALS } from '@/lib/meals-data';
import { getAllPosts } from '@/lib/blog';

const BASE_URL = 'https://www.joesmealmap.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const recipeEntries: MetadataRoute.Sitemap = MEALS.map(r => ({
    url: `${BASE_URL}/recipes/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const blogPosts = getAllPosts();
  const blogEntries: MetadataRoute.Sitemap = blogPosts.map(p => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${BASE_URL}/planner`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${BASE_URL}/recipes`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    ...recipeEntries,
    ...blogEntries,
  ];
}
```

- [ ] **Step 3: Add "From the Blog" section to `app/page.tsx`**

Add `getAllPosts` import at the top:
```tsx
import { getAllPosts } from '@/lib/blog';
```

Inside `HomePage()`, after the `imageSet` declaration, add:
```tsx
const recentPosts = getAllPosts().slice(0, 3);
```

Add this section in the JSX **between the "Latest Recipes" section closing `</section>` and the `{/* How it works */}` section**:

```tsx
{/* From the Blog */}
{recentPosts.length > 0 && (
  <section style={{ padding: '0 24px 80px' }}>
    <div className="section-inner">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '28px' }}>
        <h2 className="section-title" style={{ margin: 0, textAlign: 'left' }}>
          From the Blog
        </h2>
        <Link
          href="/blog"
          style={{ fontSize: '14px', fontWeight: 600, color: '#22C55E', textDecoration: 'none', whiteSpace: 'nowrap' }}
        >
          View all posts →
        </Link>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {recentPosts.map(post => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            style={{
              display: 'grid',
              gridTemplateColumns: '120px 1fr',
              gap: '16px',
              padding: '16px',
              background: '#fff',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'box-shadow 0.2s',
            }}
          >
            <div style={{ borderRadius: '8px', overflow: 'hidden', aspectRatio: '4/3', background: '#f0ede6' }}>
              {post.coverImage && (
                <img
                  src={post.coverImage}
                  alt={post.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '6px' }}>
              <p style={{ fontFamily: 'var(--font-dm-mono), DM Mono, monospace', fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
                {new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(post.date + 'T12:00:00'))}
              </p>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', lineHeight: 1.35, margin: 0 }}>
                {post.title}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                {post.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
)}
```

- [ ] **Step 4: Build to verify all three changes work**

```bash
npm run build 2>&1 | tail -30
```

Expected: build succeeds, route list shows `/blog` static page and `/blog/[slug]` with the sample post, no TypeScript errors.

- [ ] **Step 5: Commit all three changes**

```bash
git add components/NavBar.tsx app/sitemap.ts app/page.tsx
git commit -m "feat: add Blog nav link, sitemap entries, and From the Blog homepage section"
```

---

### Task 6: Push and deploy

- [ ] **Step 1: Push to GitHub**

```bash
git push
```

Expected: push succeeds, Vercel auto-deploy triggers.

- [ ] **Step 2: Verify on production once deployed**

- Visit `https://www.joesmealmap.com/blog` — confirm post card renders with cover image and tags
- Visit `https://www.joesmealmap.com/blog/how-to-hit-50g-protein-at-breakfast` — confirm: cover image, title, formatted date, MDX prose with styled headings and links, related recipes section with "Related Recipes" heading (not "Joe's Top High-Protein Picks" since "breakfast" tag matches many recipes)
- View page source — confirm `<script type="application/ld+json">` with `BlogPosting` schema
- Check navbar — "Blog" link visible between Recipes and About
- Check homepage — "From the Blog" section visible above "How it works"

---

## Spec Coverage Check

| Requirement | Task |
|---|---|
| `lib/blog.ts` with fs + gray-matter, reads title/description/date/slug/coverImage/tags | Task 1 |
| Blog index at `/blog` with grid, cards, sort newest first | Task 3 |
| Blog index metadata + canonical + openGraph | Task 3 |
| Blog card: cover image, date, tags, title, description, "Read more →" | Task 3 |
| Blog post page at `/blog/[slug]` | Task 4 |
| Next.js 15: params as Promise, awaited before use | Task 4 |
| `generateStaticParams` using content/blog/ slugs | Task 4 |
| `export const dynamicParams = false` | Task 4 |
| `notFound()` for invalid slugs | Task 4 |
| 720px max-width centered layout | Task 4 |
| Cover image full width, rounded 12px | Task 4 |
| Title in large bold DM Sans | Task 4 |
| Blog prose: DM Sans body, #22C55E links, styled headings | Task 1 (CSS) + Task 4 |
| JSON-LD BlogPosting with timeRequired | Task 4 |
| Metadata with canonical + openGraph coverImage | Task 4 |
| Related Recipes: 3 matching by tags, fallback to high-protein, dynamic heading | Task 4 |
| `compileMDX` from `next-mdx-remote/rsc` | Task 4 |
| gray-matter for frontmatter in utility | Task 1 |
| Sample post 1000-1400 words, Joe's voice, recipe links, FAQ | Task 2 |
| Blog nav link between Recipes and About | Task 5 |
| Sitemap: /blog index + all post URLs | Task 5 |
| Homepage "From the Blog" section above email, 3 horizontal cards | Task 5 |
| "View all posts →" link | Task 5 |
| `rel="sponsored nofollow"` on affiliate links in MDX | Task 2 (no affiliate links in sample post) |
| 3-col desktop / 2-col tablet / 1-col mobile grid | Task 3 (uses existing `.recipe-grid`) |

import Link from 'next/link';
import Image from 'next/image';
import NavBar from '@/components/NavBar';
import SubscribeForm from '@/components/SubscribeForm';
import WelcomeBanner from '@/components/WelcomeBanner';
import { MEALS } from '@/lib/meals-data';
import { getAllPosts } from '@/lib/blog';
import { readdirSync } from 'fs';
import { join } from 'path';

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

const PROTO_EMOJI: Record<string, string> = {
  chicken: '🍗', beef: '🥩', fish: '🐟', yogurt: '🥛',
  eggs: '🥚', pork: '🐷', legumes: '🫘', tofu: '🌱',
};

const TYPE_LABEL: Record<string, string> = {
  breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack', dessert: 'Dessert',
};

export default function HomePage() {
  let slugsWithImages: string[] = [];
  try {
    slugsWithImages = readdirSync(join(process.cwd(), 'public', 'recipes'))
      .filter(f => f.endsWith('.jpg'))
      .map(f => f.replace('.jpg', ''));
  } catch {
    // public/recipes/ does not exist yet
  }
  const imageSet = new Set(slugsWithImages);

  // Latest recipe with a photo for the hero right side
  const heroRecipe =
    [...MEALS].reverse().find(r => imageSet.has(r.slug)) ?? MEALS[MEALS.length - 1];
  const heroRecipeHasImage = imageSet.has(heroRecipe.slug);

  // Last 6 in MEALS for the recipes grid
  const latestRecipes = MEALS.slice(-6);

  const recentPosts = getAllPosts().slice(0, 3);
  const heroPost = recentPosts[0] ?? null;

  return (
    <>
      <NavBar />
      <WelcomeBanner />
      <main className="home-main">

        {/* Hero image with overlay links onto the baked-in CTA buttons, aligned to content width */}
        <div className="section-inner" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="hero-image-section">
            <Image
              src="/hero-image.jpg"
              alt="Joe's MealMap — real food, real results"
              width={1828}
              height={860}
              priority
            />
            <Link
              href="/planner"
              aria-label="Start Planning"
              className="hero-overlay-btn"
              style={{ left: '6.67%', top: '59.30%', width: '14.11%', height: '6.74%' }}
            />
            <Link
              href="/recipes"
              aria-label="Browse Recipes"
              className="hero-overlay-btn"
              style={{ left: '21.55%', top: '59.30%', width: '13.57%', height: '6.74%' }}
            />
          </div>
        </div>

        {/* Split Screen Hero — latest blog post + latest recipe */}
        <section style={{ padding: '32px 24px 48px' }}>
          <div className="section-inner" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="split-hero-card">
              <div className="split-hero-grid">

                {/* Left: Latest Blog Post */}
                {heroPost ? (
                  <div className="split-hero-left">
                    <p className="split-hero-label">Latest Post</p>
                    <Link href={`/blog/${heroPost.slug}`} className="split-hero-img" style={{ display: 'block', textDecoration: 'none' }}>
                      {heroPost.coverImage && (
                        <img src={heroPost.coverImage} alt={heroPost.title} style={{ transition: 'opacity 0.2s' }} />
                      )}
                    </Link>
                    {heroPost.tags.length > 0 && (
                      <div className="split-hero-tags">
                        {heroPost.tags.map(tag => (
                          <span key={tag} className="split-hero-tag">{tag}</span>
                        ))}
                      </div>
                    )}
                    <h2 className="split-hero-title">{heroPost.title}</h2>
                    <p className="split-hero-desc">{heroPost.description}</p>
                    <div className="split-hero-cta">
                      <Link href={`/blog/${heroPost.slug}`} className="btn-primary" style={{ background: '#166534' }}>
                        Read Post →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="split-hero-left" style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Blog posts coming soon.</p>
                  </div>
                )}

                {/* Right: Latest Recipe */}
                <div className="split-hero-right">
                  <p className="split-hero-label">Latest Recipe</p>
                  <Link href={`/recipes/${heroRecipe.slug}`} className="split-hero-img" style={{ display: 'block', textDecoration: 'none' }}>
                    {heroRecipeHasImage ? (
                      <img src={`/recipes/${heroRecipe.slug}.jpg`} alt={heroRecipe.name} style={{ transition: 'opacity 0.2s' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '64px' }}>{PROTO_EMOJI[heroRecipe.proto] ?? '🍴'}</span>
                      </div>
                    )}
                  </Link>
                  <div className="split-hero-tags">
                    <span className="split-hero-tag">{TYPE_LABEL[heroRecipe.type] ?? heroRecipe.type}</span>
                  </div>
                  <h2 className="split-hero-title">{heroRecipe.name}</h2>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span className="rcm rcm-cal">{heroRecipe.cal} cal</span>
                    <span className="rcm rcm-pro">{heroRecipe.pro}g protein</span>
                  </div>
                  <div className="split-hero-cta">
                    <Link href={`/recipes/${heroRecipe.slug}`} className="btn-primary" style={{ background: '#166534' }}>
                      View Recipe →
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Latest Recipes Grid */}
        <section style={{ padding: '0 24px 80px' }}>
          <div className="section-inner" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="section-header">
              <span className="section-eyebrow">Fresh from the kitchen</span>
              <h2 className="section-title">Latest Recipes</h2>
            </div>

            <div className="recipe-grid">
              {latestRecipes.map(recipe => (
                <Link key={recipe.slug} href={`/recipes/${recipe.slug}`} className="recipe-card">
                  <div className="recipe-card-img-wrap">
                    {imageSet.has(recipe.slug) ? (
                      <img
                        src={`/recipes/${recipe.slug}.jpg`}
                        alt={recipe.name}
                        width={400}
                        height={300}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    ) : (
                      <div className="recipe-card-img-placeholder">
                        <span className="recipe-card-img-emoji">
                          {PROTO_EMOJI[recipe.proto] ?? '🍴'}
                        </span>
                      </div>
                    )}
                    <div className="recipe-card-type-tag">
                      {TYPE_LABEL[recipe.type] ?? recipe.type}
                    </div>
                  </div>
                  <div className="recipe-card-body">
                    <h3 className="recipe-card-name">{recipe.name}</h3>
                    <div className="recipe-card-macros" style={{ marginTop: 'auto' }}>
                      <span className="rcm rcm-pro">{recipe.pro}g protein</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="recipes-cta-row">
              <Link href="/recipes" className="btn-secondary">View all recipes →</Link>
            </div>
          </div>
        </section>

        {/* From the Blog */}
        {recentPosts.length > 0 && (
          <section style={{ padding: '0 24px 80px' }}>
            <div className="section-inner" style={{ maxWidth: '1200px', margin: '0 auto' }}>
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

        {/* How it works */}
        <section className="how-section">
          <div className="section-inner" style={{ maxWidth: '1200px', margin: '0 auto' }}>
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

        {/* Email Capture */}
        <section className="email-section">
          <div className="email-inner">
            <h2 className="email-headline">New recipes every week.</h2>
            <p className="email-sub">
              Join the list. Get fresh meal ideas, macro tips, and the occasional food rant from Joe.
            </p>
            <SubscribeForm />
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

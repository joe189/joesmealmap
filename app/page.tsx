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

  // Last recipe in MEALS that has a photo; falls back to absolute last if none
  const featured =
    [...MEALS].reverse().find(r => imageSet.has(r.slug)) ?? MEALS[MEALS.length - 1];
  const featuredHasImage = imageSet.has(featured.slug);

  // Last 6 in MEALS (most recently added)
  const latestRecipes = MEALS.slice(-6);

  const recentPosts = getAllPosts().slice(0, 3);

  return (
    <>
      <NavBar />
      <WelcomeBanner />
      <main className="home-main">

        {/* Featured Recipe Hero */}
        <section style={{ padding: '48px 24px 60px' }}>
          <div className="section-inner">
            <p style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: '16px',
            }}>
              Featured Recipe
            </p>

            <div className="featured-hero-grid">
              {/* Photo — 60% */}
              <div className="featured-hero-photo">
                {featuredHasImage ? (
                  <Image
                    src={`/recipes/${featured.slug}.jpg`}
                    alt={featured.name}
                    fill
                    sizes="(max-width: 900px) 100vw, 60vw"
                    style={{ objectFit: 'cover' }}
                    priority
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: '#f0ede6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: '96px' }}>
                      {PROTO_EMOJI[featured.proto] ?? '🍴'}
                    </span>
                  </div>
                )}
              </div>

              {/* Info — 40% */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '20px',
                padding: '8px 0',
              }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: '#DCFCE7',
                  color: '#166534',
                  fontSize: '12px',
                  fontWeight: 600,
                  padding: '4px 12px',
                  borderRadius: '99px',
                  width: 'fit-content',
                }}>
                  {TYPE_LABEL[featured.type] ?? featured.type}
                </span>

                <h2 style={{
                  fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif',
                  fontSize: 'clamp(26px, 3vw, 40px)',
                  fontWeight: 700,
                  lineHeight: 1.15,
                  letterSpacing: '-0.5px',
                  color: 'var(--text)',
                  margin: 0,
                }}>
                  {featured.name}
                </h2>

                <p style={{
                  fontSize: '15px',
                  color: 'var(--text-muted)',
                  lineHeight: 1.6,
                  margin: 0,
                }}>
                  {featured.description}
                </p>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="rcm rcm-cal">{featured.cal} cal</span>
                  <span className="rcm rcm-pro">{featured.pro}g protein</span>
                </div>

                <div>
                  <Link
                    href={`/recipes/${featured.slug}`}
                    className="btn-primary"
                    style={{ background: '#166534' }}
                  >
                    View Recipe →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Recipes Grid */}
        <section style={{ padding: '0 24px 80px' }}>
          <div className="section-inner">
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

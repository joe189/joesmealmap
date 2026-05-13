import Link from 'next/link';
import Image from 'next/image';
import NavBar from '@/components/NavBar';
import recipesRaw from '@/lib/recipes-merged.json';
import { readdirSync } from 'fs';
import { join } from 'path';

type Recipe = {
  slug: string; name: string; type: string; proto: string;
  prepTime: number; cookTime: number; totalTime: number;
  cal: number; pro: number; carb: number; fat: number; cost: number;
  description: string; photoSearch: string;
};

const recipes = recipesRaw as Recipe[];

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

const FEATURED_SLUGS = [
  'grilled-chicken-rice-bowl',
  'baked-salmon-sweet-potato',
  'beef-taco-bowl',
  'greek-yogurt-berry-bowl',
  'chicken-tikka-masala',
  'chicken-caesar-salad',
];

const PROTO_COLORS: Record<string, { bg: string; text: string }> = {
  chicken:  { bg: '#FFF3E0', text: '#E65100' },
  beef:     { bg: '#FCE4EC', text: '#C62828' },
  fish:     { bg: '#E3F2FD', text: '#1565C0' },
  yogurt:   { bg: '#F3E5F5', text: '#6A1B9A' },
  eggs:     { bg: '#FFFDE7', text: '#F57F17' },
  pork:     { bg: '#FBE9E7', text: '#BF360C' },
  legumes:  { bg: '#E8F5E9', text: '#2E7D32' },
  tofu:     { bg: '#E0F2F1', text: '#00695C' },
};

const PROTO_EMOJI: Record<string, string> = {
  chicken: '🍗', beef: '🥩', fish: '🐟', yogurt: '🥛',
  eggs: '🥚', pork: '🐷', legumes: '🫘', tofu: '🌱',
};

const TYPE_LABEL: Record<string, string> = {
  breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack',
};

export default function HomePage() {
  const featured = FEATURED_SLUGS
    .map(slug => recipes.find(r => r.slug === slug))
    .filter(Boolean) as Recipe[];

  let slugsWithImages: string[] = [];
  try {
    slugsWithImages = readdirSync(join(process.cwd(), 'public', 'recipes'))
      .filter(f => f.endsWith('.jpg'))
      .map(f => f.replace('.jpg', ''));
  } catch {
    // public/recipes/ does not exist yet — no images downloaded
  }
  const imageSet = new Set(slugsWithImages);

  return (
    <>
      <NavBar />
      <main className="home-main">

        {/* Hero */}
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-photo-col">
              <div className="hero-photo-wrap">
                <Image
                  src="/joe.webp"
                  alt="Joe Jennings, founder of Joe's MealMap"
                  width={420}
                  height={520}
                  priority
                  className="hero-photo"
                />
              </div>
            </div>
            <div className="hero-text-col">
              <span className="hero-eyebrow">Meal planning, simplified</span>
              <h1 className="hero-headline">
                Eat right without<br />overthinking it.
              </h1>
              <p className="hero-sub">
                Set your macro targets, pick meals you actually want to eat, and get a complete shopping list sent to your inbox. Takes about 3 minutes.
              </p>
              <div className="hero-actions">
                <Link href="/planner" className="btn-primary">Start Planning →</Link>
                <Link href="/recipes" className="btn-secondary">Browse Recipes</Link>
              </div>
              <div className="hero-stats">
                <div className="hero-stat">
                  <span className="hero-stat-num">100+</span>
                  <span className="hero-stat-lbl">Recipes</span>
                </div>
                <div className="hero-stat-divider" />
                <div className="hero-stat">
                  <span className="hero-stat-num">6</span>
                  <span className="hero-stat-lbl">Diet goals</span>
                </div>
                <div className="hero-stat-divider" />
                <div className="hero-stat">
                  <span className="hero-stat-num">Free</span>
                  <span className="hero-stat-lbl">Forever</span>
                </div>
              </div>
            </div>
          </div>
        </section>

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

        {/* Featured Recipes */}
        <section className="recipes-section">
          <div className="section-inner">
            <div className="section-header">
              <span className="section-eyebrow">From the database</span>
              <h2 className="section-title">Meals worth eating every week</h2>
              <p className="section-sub">
                Every recipe is built around hitting your macros — not sacrificing flavor to do it.
              </p>
            </div>
            <div className="recipe-grid">
              {featured.map((recipe) => {
                const protoColor = PROTO_COLORS[recipe.proto] ?? { bg: '#F5F5F5', text: '#555' };
                return (
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
                      <div
                        className="recipe-card-proto-tag"
                        style={{ background: protoColor.bg, color: protoColor.text }}
                      >
                        {recipe.proto.charAt(0).toUpperCase() + recipe.proto.slice(1)}
                      </div>
                      <div className="recipe-card-type-tag">
                        {TYPE_LABEL[recipe.type] ?? recipe.type}
                      </div>
                    </div>
                    <div className="recipe-card-body">
                      <h3 className="recipe-card-name">{recipe.name}</h3>
                      <p className="recipe-card-desc">{recipe.description}</p>
                      <div className="recipe-card-macros">
                        <span className="rcm rcm-cal">{recipe.cal} cal</span>
                        <span className="rcm rcm-pro">{recipe.pro}g protein</span>
                        <span className="rcm rcm-time">⏱ {recipe.totalTime} min</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="recipes-cta-row">
              <Link href="/recipes" className="btn-secondary">View all recipes →</Link>
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
            <form
              className="email-form"
              action="https://joesmealmap.beehiiv.com/subscribe"
              method="POST"
              target="_blank"
              rel="noopener noreferrer"
            >
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                required
                className="email-input"
              />
              <button type="submit" className="btn-primary email-submit">
                Subscribe
              </button>
            </form>
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

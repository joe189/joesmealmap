import Link from 'next/link';
import NavBar from '@/components/NavBar';
import { getAmazonLink } from '@/lib/amazon';
import type { SeoPageConfig } from '@/lib/seo-pages';
import type { MealData } from '@/lib/meals-data';

const BASE_URL = 'https://www.joesmealmap.com';

const PROTO_EMOJI: Record<string, string> = {
  chicken: '🍗', beef: '🥩', fish: '🐟', yogurt: '🥛',
  eggs: '🥚', pork: '🐷', legumes: '🫘', tofu: '🌱',
};

const TYPE_LABEL: Record<string, string> = {
  breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner',
  snack: 'Snack', dessert: 'Dessert',
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

type Props = {
  config: SeoPageConfig;
  recipes: MealData[];
  relatedRecipes: MealData[];
  slugsWithImages: Set<string>;
  pageLinks: { slug: string; navTitle: string; canonical: string }[];
};

function RecipeCard({ r, slugsWithImages }: { r: MealData; slugsWithImages: Set<string> }) {
  const hasImage = slugsWithImages.has(r.slug);
  const protoColor = PROTO_COLORS[r.proto] ?? { bg: '#F5F5F5', text: '#555' };
  return (
    <div className="recipe-card">
      <Link href={`/recipes/${r.slug}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
        <div className="recipe-card-img-wrap">
          {hasImage ? (
            <img
              src={`/recipes/${r.slug}.jpg`}
              alt={r.name}
              width={400}
              height={300}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div className="recipe-card-img-placeholder">
              <span className="recipe-card-img-emoji">{PROTO_EMOJI[r.proto] ?? '🍴'}</span>
            </div>
          )}
          <div
            className="recipe-card-proto-tag"
            style={{ background: protoColor.bg, color: protoColor.text }}
          >
            {r.proto.charAt(0).toUpperCase() + r.proto.slice(1)}
          </div>
          <div className="recipe-card-type-tag">{TYPE_LABEL[r.type] ?? r.type}</div>
          <div className="recipe-card-name-overlay">{r.name}</div>
        </div>
        <div className="recipe-card-body">
          <div className="recipe-card-macros">
            <span className="rcm rcm-cal">{r.cal} cal</span>
            <span className="rcm rcm-pro">{r.pro}g protein</span>
          </div>
        </div>
      </Link>
      <div style={{ padding: '0 20px 16px' }}>
        <a
          href={getAmazonLink(r.name)}
          target="_blank"
          rel="sponsored nofollow"
          style={{ fontSize: '12px', color: '#22C55E', textDecoration: 'none', fontWeight: 500 }}
        >
          Shop ingredients →
        </a>
      </div>
    </div>
  );
}

export default function SeoCategoryPage({
  config,
  recipes,
  relatedRecipes,
  slugsWithImages,
  pageLinks,
}: Props) {
  const otherLinks = pageLinks.filter(l => l.slug !== config.slug);
  const showRelated = recipes.length > 0 && recipes.length < 6 && relatedRecipes.length > 0;

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: config.h1,
    url: `${BASE_URL}${config.canonical}`,
    numberOfItems: recipes.length,
    itemListElement: recipes.map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: r.name,
      url: `${BASE_URL}/recipes/${r.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <NavBar />
      <main className="recipes-page-main">
        <div className="section-inner">

          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link> →{' '}
            <Link href="/recipes">Recipes</Link> →{' '}
            {config.navTitle}
          </nav>

          <header className="recipes-page-header">
            <span className="section-eyebrow">{config.eyebrow}</span>
            <h1 className="section-title">{config.h1}</h1>
            <p className="section-sub" style={{ maxWidth: '640px', margin: '0 auto 8px' }}>
              {config.intro}
            </p>
            <p className="recipes-count">{recipes.length} recipes</p>
          </header>

          {recipes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
                No recipes found for this filter.
              </p>
              <Link href="/recipes" className="btn-secondary">Browse all recipes</Link>
            </div>
          ) : (
            <div className="recipe-grid">
              {recipes.map(r => (
                <RecipeCard key={r.slug} r={r} slugsWithImages={slugsWithImages} />
              ))}
            </div>
          )}

          {showRelated && (
            <section style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                Related High-Protein Recipes
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Looking for more options? These high-protein recipes are worth a look too.
              </p>
              <div className="recipe-grid">
                {relatedRecipes.map(r => (
                  <RecipeCard key={r.slug} r={r} slugsWithImages={slugsWithImages} />
                ))}
              </div>
            </section>
          )}

          <div className="recipes-cta-row" style={{ marginTop: '48px' }}>
            <Link href="/planner" className="btn-primary">Plan my meals →</Link>
            <Link href="/recipes" className="btn-secondary" style={{ marginLeft: '12px' }}>
              Browse all recipes
            </Link>
          </div>

          <section style={{ marginTop: '64px', paddingTop: '48px', borderTop: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '32px' }}>
              Frequently Asked Questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {config.faq.map((item, i) => (
                <div key={i}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--text)' }}>
                    {item.q}
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }}>
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginTop: '64px', paddingTop: '48px', borderTop: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>
              More High Protein Recipe Collections
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {otherLinks.map(l => (
                <Link
                  key={l.slug}
                  href={l.canonical}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '8px 16px',
                    border: '1.5px solid var(--border-strong)',
                    borderRadius: '99px',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'var(--text)',
                    textDecoration: 'none',
                    background: '#fff',
                  }}
                >
                  {l.navTitle}
                </Link>
              ))}
            </div>
          </section>

        </div>
      </main>
    </>
  );
}

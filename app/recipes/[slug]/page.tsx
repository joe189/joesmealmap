import Link from 'next/link';
import NavBar from '@/components/NavBar';
import recipesRaw from '@/lib/recipes-merged.json';
import { existsSync } from 'fs';
import { join } from 'path';

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
  const recipeImagePath = `/recipes/${recipe.slug}.jpg`;
  const hasImage = existsSync(join(process.cwd(), 'public', recipeImagePath));

  const recipeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.name,
    description: recipe.description,
    image: [`${BASE_URL}${hasImage ? recipeImagePath : OG_FALLBACK}`],
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
    author: {
      '@type': 'Person',
      name: 'Joe Jennings',
      url: 'https://www.joesmealmap.com/about',
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
            <section style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
                More {TYPE_LABEL[recipe.type] ?? 'Recipes'} You Might Like
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                {related.map(r => (
                  <Link
                    key={r.slug}
                    href={`/recipes/${r.slug}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      color: 'var(--text)',
                    }}
                  >
                    <span style={{ fontSize: '28px' }}>{PROTO_EMOJI[r.proto] ?? '🍴'}</span>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '4px' }}>{r.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{r.cal} cal · {r.pro}g protein</div>
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

import Link from 'next/link';
import NavBar from '@/components/NavBar';
import { notFound } from 'next/navigation';
import { CATEGORIES, type CategoryRecipe } from '@/lib/categories';
import recipesRaw from '@/lib/recipes-merged.json';
import type { Metadata } from 'next';

export const dynamicParams = false;

const allRecipes = recipesRaw as CategoryRecipe[];

const PROTO_EMOJI: Record<string, string> = {
  chicken: '🍗', beef: '🥩', fish: '🐟', yogurt: '🥛',
  eggs: '🥚', pork: '🐷', legumes: '🫘', tofu: '🌱',
};

const TYPE_LABEL: Record<string, string> = {
  breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack',
};

export async function generateStaticParams() {
  return CATEGORIES.map(c => ({ category: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ category: string }> }
): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES.find(c => c.slug === category);
  if (!cat) return {};

  return {
    title: cat.title,
    description: cat.description,
    alternates: {
      canonical: `/${cat.slug}`,
    },
    openGraph: {
      title: cat.title,
      description: cat.description,
      url: `https://www.joesmealmap.com/${cat.slug}`,
      type: 'website',
    },
  };
}

export default async function CategoryPage(
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;
  const cat = CATEGORIES.find(c => c.slug === category);
  if (!cat) notFound();

  const matched = allRecipes.filter(cat.filter);

  return (
    <>
      <NavBar />
      <main className="recipes-page-main">
        <div className="section-inner">

          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link> →{' '}
            <Link href="/recipes">Recipes</Link> →{' '}
            {cat.title}
          </nav>

          <header className="recipes-page-header">
            <span className="section-eyebrow">{cat.eyebrow}</span>
            <h1 className="section-title">{cat.title}</h1>
            <p className="section-sub">{cat.description}</p>
            <p className="recipes-count">{matched.length} recipes</p>
          </header>

          <div className="recipe-grid">
            {matched.map(r => (
              <Link key={r.slug} href={`/recipes/${r.slug}`} className="recipe-card">
                <div className="recipe-card-img-wrap">
                  <div className="recipe-card-img-placeholder">
                    <span className="recipe-card-img-emoji">{PROTO_EMOJI[r.proto] ?? '🍴'}</span>
                  </div>
                  <div className="recipe-card-type-tag">{TYPE_LABEL[r.type] ?? r.type}</div>
                </div>
                <div className="recipe-card-body">
                  <h3 className="recipe-card-name">{r.name}</h3>
                  <p className="recipe-card-desc">{r.description}</p>
                  <div className="recipe-card-macros">
                    <span className="rcm rcm-cal">{r.cal} cal</span>
                    <span className="rcm rcm-pro">{r.pro}g protein</span>
                    <span className="rcm rcm-time">⏱ {r.totalTime} min</span>
                    <span className="rcm rcm-cost">~${r.cost}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="recipes-cta-row" style={{ marginTop: '48px' }}>
            <Link href="/planner" className="btn-primary">Plan my meals with these →</Link>
            <Link href="/recipes" className="btn-secondary" style={{ marginLeft: '12px' }}>
              Browse all recipes
            </Link>
          </div>

        </div>
      </main>
    </>
  );
}

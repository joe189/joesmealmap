import { readdirSync } from 'fs';
import { join } from 'path';
import { getSeoPage, SEO_PAGE_LINKS } from '@/lib/seo-pages';
import { MEALS } from '@/lib/meals-data';
import SeoCategoryPage from '@/components/SeoCategoryPage';
import type { Metadata } from 'next';

const PAGE_SLUG = 'high-protein-snacks';

export function generateMetadata(): Metadata {
  const config = getSeoPage(PAGE_SLUG)!;
  const recipes = config.getRecipes();
  return {
    title: config.title,
    description: config.metaDescription,
    alternates: { canonical: config.canonical },
    openGraph: {
      title: config.title,
      description: config.metaDescription,
      url: `https://www.joesmealmap.com${config.canonical}`,
      type: 'website',
    },
    ...(recipes.length === 0 ? { robots: { index: false } } : {}),
  };
}

export default function Page() {
  const config = getSeoPage(PAGE_SLUG)!;
  const recipes = config.getRecipes();
  const slugSet = new Set(recipes.map(r => r.slug));
  const relatedRecipes = recipes.length < 6
    ? MEALS.filter(r => r.pro >= 30 && !slugSet.has(r.slug))
        .sort((a, b) => b.pro - a.pro)
        .slice(0, 6)
    : [];

  let slugsWithImages = new Set<string>();
  try {
    const files = readdirSync(join(process.cwd(), 'public', 'recipes'));
    slugsWithImages = new Set(
      files.filter(f => f.endsWith('.jpg')).map(f => f.replace('.jpg', '')),
    );
  } catch {
    // public/recipes/ does not exist yet
  }

  return (
    <SeoCategoryPage
      config={config}
      recipes={recipes}
      relatedRecipes={relatedRecipes}
      slugsWithImages={slugsWithImages}
      pageLinks={SEO_PAGE_LINKS}
    />
  );
}

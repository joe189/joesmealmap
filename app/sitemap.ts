import type { MetadataRoute } from 'next';
import recipesRaw from '@/lib/recipes-merged.json';

const BASE_URL = 'https://www.joesmealmap.com';

const recipes = recipesRaw as { slug: string }[];

export default function sitemap(): MetadataRoute.Sitemap {
  const recipeEntries: MetadataRoute.Sitemap = recipes.map(r => ({
    url: `${BASE_URL}/recipes/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/planner`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/recipes`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    ...recipeEntries,
  ];
}

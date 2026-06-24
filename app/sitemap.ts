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

import type { MetadataRoute } from 'next';

const BASE_URL = 'https://www.joesmealmap.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/', '/admin/', '/account/', '/settings/', '/login/', '/signup/'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

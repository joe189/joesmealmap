import Link from 'next/link';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import NavBar from '@/components/NavBar';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { MEALS, type MealData } from '@/lib/meals-data';
import type { Metadata } from 'next';

export const dynamicParams = false;

const BASE_URL = 'https://www.joesmealmap.com';

const PROTO_EMOJI: Record<string, string> = {
  chicken: '🍗', beef: '🥩', fish: '🐟', yogurt: '🥛',
  eggs: '🥚', pork: '🐷', legumes: '🫘', tofu: '🌱',
};

const TYPE_LABEL: Record<string, string> = {
  breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack', dessert: 'Dessert',
};

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateStr + 'T12:00:00'));
}

function getRelatedRecipes(postTags: string[]): { recipes: MealData[]; usedFallback: boolean } {
  const matched = MEALS.filter(r =>
    postTags.some(tag => r.type === tag || r.tags.includes(tag)),
  ).sort((a, b) => b.pro - a.pro);

  if (matched.length >= 3) {
    return { recipes: matched.slice(0, 3), usedFallback: false };
  }

  const matchedSlugs = new Set(matched.map(r => r.slug));
  const fillers = MEALS
    .filter(r => !matchedSlugs.has(r.slug))
    .sort((a, b) => b.pro - a.pro)
    .slice(0, 3 - matched.length);

  return { recipes: [...matched, ...fillers], usedFallback: fillers.length > 0 };
}

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const { frontmatter: fm } = post;
  return {
    title: fm.title,
    description: fm.description,
    alternates: { canonical: `/blog/${fm.slug}` },
    openGraph: {
      title: fm.title,
      description: fm.description,
      url: `${BASE_URL}/blog/${fm.slug}`,
      type: 'article',
      publishedTime: fm.date,
      images: fm.coverImage
        ? [{ url: `${BASE_URL}${fm.coverImage}`, width: 1200, height: 630, alt: fm.title }]
        : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { frontmatter: fm, content: rawContent } = post;

  const { content } = await compileMDX({
    source: rawContent,
    options: { mdxOptions: { format: 'mdx' } },
  });

  const wordCount = rawContent.split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const { recipes: relatedRecipes, usedFallback } = getRelatedRecipes(fm.tags);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: fm.title,
    description: fm.description,
    image: fm.coverImage ? `${BASE_URL}${fm.coverImage}` : undefined,
    datePublished: fm.date,
    timeRequired: `PT${readingMinutes}M`,
    keywords: fm.tags.join(', '),
    author: {
      '@type': 'Person',
      name: 'Joe Jennings',
      url: `${BASE_URL}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: "Joe's MealMap",
      url: BASE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blog/${fm.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NavBar />
      <main style={{ background: '#fafaf8', minHeight: '100vh', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px' }}>

          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link> →{' '}
            <Link href="/blog">Blog</Link> →{' '}
            {fm.title}
          </nav>

          {fm.coverImage && (
            <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '36px', aspectRatio: '16/9' }}>
              <img
                src={fm.coverImage}
                alt={fm.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          )}

          <header style={{ marginBottom: '40px' }}>
            {fm.tags.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {fm.tags.map(tag => (
                  <span
                    key={tag}
                    style={{ background: '#DCFCE7', color: '#166534', fontSize: '12px', fontWeight: 600, padding: '4px 12px', borderRadius: '99px', textTransform: 'capitalize' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <h1 style={{
              fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif',
              fontSize: 'clamp(26px, 4vw, 38px)',
              fontWeight: 700,
              lineHeight: 1.18,
              letterSpacing: '-0.4px',
              color: 'var(--text)',
              marginBottom: '16px',
            }}>
              {fm.title}
            </h1>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              <span style={{ fontFamily: 'var(--font-dm-mono), DM Mono, monospace' }}>
                {formatDate(fm.date)}
              </span>
              <span>·</span>
              <span>{readingMinutes} min read</span>
            </div>
          </header>

          <article className="blog-prose">
            {content}
          </article>

          {relatedRecipes.length > 0 && (
            <section style={{ marginTop: '64px', paddingTop: '48px', borderTop: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', color: 'var(--text)' }}>
                {usedFallback ? "Joe's Top High-Protein Picks" : 'Related Recipes'}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {relatedRecipes.map(r => (
                  <Link
                    key={r.slug}
                    href={`/recipes/${r.slug}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '14px',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      color: 'inherit',
                      background: '#fff',
                    }}
                  >
                    <span style={{ fontSize: '32px', lineHeight: 1, flexShrink: 0 }}>
                      {PROTO_EMOJI[r.proto] ?? '🍴'}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px', color: 'var(--text)' }}>
                        {r.name}
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                        {TYPE_LABEL[r.type] ?? r.type} · {r.cal} cal · {r.pro}g protein
                      </p>
                    </div>
                    <span style={{ fontSize: '13px', color: '#22C55E', fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>
                      View recipe →
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div style={{ marginTop: '48px', textAlign: 'center' }}>
            <Link href="/blog" className="btn-secondary">← Back to Blog</Link>
          </div>

        </div>
      </main>
    </>
  );
}

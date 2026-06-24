import Link from 'next/link';
import NavBar from '@/components/NavBar';
import { getAllPosts } from '@/lib/blog';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "The Joe's MealMap Blog",
  description: 'Meal prep tips, macro guides, and recipes worth making.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: "The Joe's MealMap Blog",
    description: 'Meal prep tips, macro guides, and recipes worth making.',
    url: 'https://www.joesmealmap.com/blog',
    type: 'website',
  },
};

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateStr + 'T12:00:00'));
}

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
      <NavBar />
      <main className="recipes-page-main">
        <div className="section-inner">
          <header className="recipes-page-header">
            <span className="section-eyebrow">From Joe&apos;s kitchen</span>
            <h1 className="section-title">The Joe&apos;s MealMap Blog</h1>
            <p className="section-sub">
              Meal prep tips, macro guides, and recipes worth making.
            </p>
          </header>

          {posts.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px 0' }}>
              No posts yet — check back soon.
            </p>
          ) : (
            <div className="recipe-grid">
              {posts.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card">
                  <div className="blog-card-img-wrap">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="blog-card-img"
                      />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                        <span style={{ fontSize: '48px' }}>📝</span>
                      </div>
                    )}
                  </div>
                  <div className="blog-card-body">
                    <p className="blog-card-date">{formatDate(post.date)}</p>
                    {post.tags.length > 0 && (
                      <div className="blog-card-tags">
                        {post.tags.map(tag => (
                          <span key={tag} className="blog-card-tag">{tag}</span>
                        ))}
                      </div>
                    )}
                    <h2 className="blog-card-title">{post.title}</h2>
                    <p className="blog-card-desc">{post.description}</p>
                    <span className="blog-card-link">Read more →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

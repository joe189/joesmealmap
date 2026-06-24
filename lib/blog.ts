import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  coverImage: string;
  tags: string[];
};

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  return fs
    .readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.mdx'))
    .map(filename => {
      const slug = filename.replace(/\.mdx$/, '');
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8');
      const { data } = matter(raw);
      return {
        slug: data.slug ?? slug,
        title: data.title ?? slug,
        description: data.description ?? '',
        date: data.date ?? '',
        coverImage: data.coverImage ?? '',
        tags: data.tags ?? [],
      } satisfies BlogPost;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): { frontmatter: BlogPost; content: string } | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    frontmatter: {
      slug: data.slug ?? slug,
      title: data.title ?? slug,
      description: data.description ?? '',
      date: data.date ?? '',
      coverImage: data.coverImage ?? '',
      tags: data.tags ?? [],
    },
    content,
  };
}

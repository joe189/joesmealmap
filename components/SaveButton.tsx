'use client';

import { useEffect, useState } from 'react';
import { createClient, isRecipeSaved, saveRecipe, unsaveRecipe } from '@/lib/supabase';

export default function SaveButton({ slug }: { slug: string }) {
  const [saved, setSaved]     = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    isRecipeSaved(slug).then(result => {
      setSaved(result);
      setLoading(false);
    });
  }, [slug]);

  async function toggle() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    if (saved) {
      await unsaveRecipe(slug);
      setSaved(false);
    } else {
      await saveRecipe(slug);
      setSaved(true);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={saved ? 'Unsave recipe' : 'Save recipe'}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width: '100%',
        padding: '13px 24px',
        fontSize: 15,
        fontWeight: 600,
        fontFamily: 'var(--font-dm-sans), "DM Sans", sans-serif',
        border: saved ? 'none' : '1.5px solid rgba(0,0,0,0.15)',
        borderRadius: 10,
        cursor: loading ? 'default' : 'pointer',
        opacity: loading ? 0.6 : 1,
        transition: 'opacity 0.15s, background 0.15s, color 0.15s',
        background: saved ? '#22C55E' : '#fff',
        color: saved ? '#fff' : '#1a1a1a',
      }}
    >
      <BookmarkIcon filled={saved} />
      {saved ? 'Saved' : 'Save Recipe'}
    </button>
  );
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

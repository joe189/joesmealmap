'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { MEALS } from '@/lib/meals-data';
import NavBar from '@/components/NavBar';

export default function ProfilePage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [savedPlans, setSavedPlans] = useState<Array<{
    id: number | string;
    plan_data: {
      savedAt: string;
      picks: Record<string, Array<{ name: string; slug: string; cal: number }>>;
    };
  }>>([]);
  const [expandedPlanIds, setExpandedPlanIds] = useState<Set<number | string>>(new Set());
  const [cols, setCols] = useState(3);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace('/login');
      } else {
        setEmail(user.email ?? '');
        setLoading(false);
      }
    });
  }, [router]);

  useEffect(() => {
    if (!email) return;
    const supabase = createClient();

    supabase
      .from('saved_recipes')
      .select('slug')
      .then(({ data }) => {
        setSavedSlugs((data ?? []).map((r: { slug: string }) => r.slug));
      });

    supabase
      .from('saved_plans')
      .select('id, plan_data')
      .order('id', { ascending: false })
      .then(({ data }) => {
        setSavedPlans(data ?? []);
      });
  }, [email]);

  useEffect(() => {
    function update() {
      setCols(window.innerWidth < 500 ? 1 : window.innerWidth < 768 ? 2 : 3);
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  function togglePlan(id: number | string) {
    setExpandedPlanIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const savedRecipes = savedSlugs
    .map(slug => MEALS.find(m => m.slug === slug))
    .filter((m): m is NonNullable<typeof m> => m !== undefined);

  if (loading) {
    return (
      <>
        <NavBar />
        <div style={styles.page}>
          <p style={styles.loadingText}>Loading…</p>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div style={styles.page}>
        <div style={styles.inner}>

          {/* Header */}
          <div style={styles.header}>
            <div style={styles.avatar}>
              {email[0]?.toUpperCase() ?? 'U'}
            </div>
            <div style={styles.headerInfo}>
              <p style={styles.emailText}>{email}</p>
              <button style={styles.editBtn} disabled>Edit Profile</button>
            </div>
          </div>

          {/* Saved Recipes */}
          <section style={styles.section}>
            <h2 style={styles.sectionHeading}>
              Saved Recipes
              <span style={styles.countBadge}>{savedRecipes.length}</span>
            </h2>
            {savedRecipes.length === 0 ? (
              <p style={styles.emptyText}>
                No saved recipes yet.{' '}
                <Link href="/recipes" style={styles.emptyLink}>Browse recipes →</Link>
              </p>
            ) : (
              <div style={{ ...styles.recipeGrid, gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
                {savedRecipes.map(recipe => (
                  <Link key={recipe.slug} href={`/recipes/${recipe.slug}`} style={styles.recipeCard}>
                    <div style={styles.recipeImgWrap}>
                      <img
                        src={`/recipes/${recipe.slug}.jpg`}
                        alt={recipe.name}
                        style={styles.recipeImg}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <div style={styles.recipeImgFallback}>🍴</div>
                    </div>
                    <div style={styles.recipeCardBody}>
                      <p style={styles.recipeName}>{recipe.name}</p>
                      <span style={styles.calBadge}>{recipe.cal} cal</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Saved Plans */}
          <section style={styles.section}>
            <h2 style={styles.sectionHeading}>
              Saved Plans
              <span style={styles.countBadge}>{savedPlans.length}</span>
            </h2>
            {savedPlans.length === 0 ? (
              <p style={styles.emptyText}>
                No saved plans yet.{' '}
                <Link href="/planner" style={styles.emptyLink}>Build a plan →</Link>
              </p>
            ) : (
              <div style={styles.planList}>
                {savedPlans.map(plan => {
                  const isExpanded = expandedPlanIds.has(plan.id);
                  const date = new Date(plan.plan_data.savedAt).toLocaleDateString('en-US', {
                    month: 'long', day: 'numeric', year: 'numeric',
                  });
                  const mealTypes = Object.entries(plan.plan_data.picks ?? {}).filter(
                    ([, meals]) => meals.length > 0
                  );
                  return (
                    <div key={String(plan.id)} style={styles.planCard}>
                      <button
                        style={styles.planHeader}
                        onClick={() => togglePlan(plan.id)}
                        aria-expanded={isExpanded}
                      >
                        <span style={styles.planDate}>{date}</span>
                        <span style={styles.chevron}>{isExpanded ? '▲' : '▼'}</span>
                      </button>
                      {isExpanded && (
                        <div style={styles.planBody}>
                          {mealTypes.map(([type, meals]) => (
                            <div key={type} style={styles.planMealRow}>
                              <p style={styles.planMealType}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </p>
                              <div style={styles.planMeals}>
                                {meals.map((meal, i) => (
                                  <div key={i} style={styles.planMealItem}>
                                    <span style={styles.planMealName}>{meal.name}</span>
                                    <span style={styles.calBadge}>{meal.cal} cal</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

        </div>
      </div>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#f7f6f2',
    fontFamily: "'DM Sans', sans-serif",
    paddingBottom: 60,
  },
  inner: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '40px 24px',
  },
  loadingText: {
    textAlign: 'center',
    padding: 60,
    color: '#888',
    fontSize: 14,
  },

  // Header
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    marginBottom: 48,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    background: '#22C55E',
    color: '#fff',
    fontSize: 26,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontFamily: "'DM Sans', sans-serif",
  },
  headerInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  emailText: {
    fontSize: 18,
    fontWeight: 600,
    color: '#1a1a1a',
    letterSpacing: '-0.2px',
  },
  editBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '7px 14px',
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    color: '#1a1a1a',
    background: '#fff',
    border: '1.5px solid #E5E7EB',
    borderRadius: 8,
    cursor: 'not-allowed',
    opacity: 0.4,
    width: 'fit-content',
  },

  // Sections
  section: {
    marginBottom: 48,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 600,
    color: '#1a1a1a',
    letterSpacing: '-0.2px',
    marginBottom: 16,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  countBadge: {
    fontSize: 12,
    fontWeight: 600,
    background: '#f0fdf4',
    color: '#166534',
    border: '1px solid #bbf7d0',
    borderRadius: 99,
    padding: '2px 8px',
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
  },
  emptyLink: {
    color: '#22C55E',
    fontWeight: 600,
    textDecoration: 'none',
  },

  // Recipe grid
  recipeGrid: {
    display: 'grid',
    gap: 16,
  },
  recipeCard: {
    background: '#fff',
    border: '1px solid rgba(0,0,0,0.08)',
    borderRadius: 12,
    overflow: 'hidden',
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
  },
  recipeImgWrap: {
    width: '100%',
    aspectRatio: '4/3',
    background: '#f3f4f6',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipeImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    position: 'relative',
    zIndex: 1,
  },
  recipeImgFallback: {
    position: 'absolute',
    fontSize: 32,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  recipeCardBody: {
    padding: '12px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    flex: 1,
  },
  recipeName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1a1a1a',
    lineHeight: 1.3,
  },
  calBadge: {
    fontSize: 12,
    fontWeight: 600,
    background: '#fff8ed',
    color: '#a05000',
    borderRadius: 99,
    padding: '2px 8px',
    width: 'fit-content',
  },

  // Plans list
  planList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  planCard: {
    background: '#fff',
    border: '1px solid rgba(0,0,0,0.08)',
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
  },
  planHeader: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 18px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },
  planDate: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1a1a1a',
  },
  chevron: {
    fontSize: 10,
    color: '#888',
  },
  planBody: {
    borderTop: '1px solid rgba(0,0,0,0.06)',
    padding: '12px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  planMealRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  planMealType: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#888',
  },
  planMeals: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  planMealItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  planMealName: {
    fontSize: 13,
    color: '#1a1a1a',
  },
};

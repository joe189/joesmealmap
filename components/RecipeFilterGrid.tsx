'use client';

import Link from 'next/link';
import { useState } from 'react';

type Recipe = {
  slug: string; name: string; type: string; proto: string;
  totalTime: number; cal: number; pro: number; carb: number;
  fat: number; cost: number; description: string;
};

const PROTO_COLORS: Record<string, { bg: string; text: string }> = {
  chicken: { bg: '#FFF3E0', text: '#E65100' },
  beef:    { bg: '#FCE4EC', text: '#C62828' },
  fish:    { bg: '#E3F2FD', text: '#1565C0' },
  yogurt:  { bg: '#F3E5F5', text: '#6A1B9A' },
  eggs:    { bg: '#FFFDE7', text: '#F57F17' },
  pork:    { bg: '#FBE9E7', text: '#BF360C' },
  legumes: { bg: '#E8F5E9', text: '#2E7D32' },
  tofu:    { bg: '#E0F2F1', text: '#00695C' },
};

const PROTO_EMOJI: Record<string, string> = {
  chicken: '🍗', beef: '🥩', fish: '🐟', yogurt: '🥛',
  eggs: '🥚', pork: '🐷', legumes: '🫘', tofu: '🌱',
};

const TYPE_LABEL: Record<string, string> = {
  breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack',
};

const VEGETARIAN_PROTOS = ['yogurt', 'eggs', 'legumes', 'tofu'];
const VEGAN_PROTOS = ['legumes', 'tofu'];

const FILTERS = [
  { id: 'breakfast',    label: 'Breakfast' },
  { id: 'lunch',        label: 'Lunch' },
  { id: 'dinner',       label: 'Dinner' },
  { id: 'snack',        label: 'Snacks' },
  { id: 'high-protein', label: 'High Protein' },
  { id: 'vegetarian',   label: 'Vegetarian' },
  { id: 'vegan',        label: 'Vegan' },
];

export default function RecipeFilterGrid({ recipes }: { recipes: Recipe[] }) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = recipes.filter(r => {
    const matchesFilter = !activeFilter || (
      activeFilter === 'high-protein' ? r.pro >= 30 :
      activeFilter === 'vegetarian'   ? VEGETARIAN_PROTOS.includes(r.proto) :
      activeFilter === 'vegan'        ? VEGAN_PROTOS.includes(r.proto) :
      r.type === activeFilter
    );
    const matchesSearch = !search || r.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <div className="filter-row">
        {FILTERS.map(f => (
          <button
            key={f.id}
            className={`filter-pill${activeFilter === f.id ? ' active' : ''}`}
            onClick={() => setActiveFilter(prev => prev === f.id ? null : f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <input
        type="search"
        className="recipes-search"
        placeholder="Search recipes…"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <p className="recipes-count">
        Showing {filtered.length} of {recipes.length} recipes
      </p>

      {filtered.length === 0 ? (
        <div className="recipes-empty">
          <p>No recipes match your filters.</p>
          <button
            className="filter-pill"
            onClick={() => { setActiveFilter(null); setSearch(''); }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="recipe-grid">
          {filtered.map(r => {
            const protoColor = PROTO_COLORS[r.proto] ?? { bg: '#F5F5F5', text: '#555' };
            return (
              <Link key={r.slug} href={`/recipes/${r.slug}`} className="recipe-card">
                <div className="recipe-card-img-wrap">
                  <div className="recipe-card-img-placeholder">
                    <span className="recipe-card-img-emoji">
                      {PROTO_EMOJI[r.proto] ?? '🍴'}
                    </span>
                  </div>
                  <div
                    className="recipe-card-proto-tag"
                    style={{ background: protoColor.bg, color: protoColor.text }}
                  >
                    {r.proto.charAt(0).toUpperCase() + r.proto.slice(1)}
                  </div>
                  <div className="recipe-card-type-tag">
                    {TYPE_LABEL[r.type] ?? r.type}
                  </div>
                  <div className="recipe-card-name-overlay">{r.name}</div>
                </div>
                <div className="recipe-card-body">
                  <p className="recipe-card-desc">{r.description}</p>
                  <div className="recipe-card-macros">
                    <span className="rcm rcm-cal">{r.cal} cal</span>
                    <span className="rcm rcm-pro">{r.pro}g protein</span>
                    <span className="rcm rcm-time">⏱ {r.totalTime} min</span>
                    <span className="rcm rcm-cost">~${r.cost}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}

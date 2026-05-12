import NavBar from '@/components/NavBar';
import RecipeFilterGrid from '@/components/RecipeFilterGrid';
import recipesRaw from '@/lib/recipes-merged.json';

type Recipe = {
  slug: string; name: string; type: string; proto: string;
  totalTime: number; cal: number; pro: number; carb: number;
  fat: number; cost: number; description: string; photoSearch: string;
};

const recipes = recipesRaw as Recipe[];

export const metadata = {
  title: 'High Protein Recipes with Macros',
  description:
    'Browse high protein breakfasts, lunches, dinners, and snacks with macros, ingredients, and step by step instructions.',
  alternates: {
    canonical: '/recipes',
  },
};

export default function RecipesPage() {
  return (
    <>
      <NavBar />
      <main className="recipes-page-main">
        <div className="section-inner">
          <header className="recipes-page-header">
            <span className="section-eyebrow">Recipe Index</span>
            <h1 className="section-title">100 meals. Built around your macros.</h1>
            <p className="section-sub">
              Browse all recipes, filter by type or goal, and click through for full ingredients and instructions.
            </p>
          </header>
          <RecipeFilterGrid recipes={recipes} />
        </div>
      </main>
    </>
  );
}

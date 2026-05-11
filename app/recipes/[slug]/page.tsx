import Link from 'next/link';
import NavBar from '@/components/NavBar';
import recipesRaw from '@/lib/recipes-merged.json';

type Ingredient = { item: string; quantity: string };
type Step      = { step: number; title: string; instruction: string };
type Recipe = {
  slug: string; name: string; type: string; proto: string;
  prepTime: number; cookTime: number; totalTime: number; servings: number;
  cal: number; pro: number; carb: number; fat: number; cost: number;
  description: string; photoSearch: string;
  ingredients: Ingredient[]; steps: Step[]; tips?: string;
};

const recipes = recipesRaw as Recipe[];

const PROTO_EMOJI: Record<string, string> = {
  chicken: '🍗', beef: '🥩', fish: '🐟', yogurt: '🥛',
  eggs: '🥚', pork: '🐷', legumes: '🫘', tofu: '🌱',
};

const TYPE_LABEL: Record<string, string> = {
  breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack',
};

export async function generateStaticParams() {
  return recipes.map(r => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = recipes.find(r => r.slug === slug);
  if (!recipe) return {};
  return {
    title: `${recipe.name} | Joe's MealMap`,
    description: recipe.description,
  };
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = recipes.find(r => r.slug === slug);

  if (!recipe) {
    return (
      <>
        <NavBar />
        <main className="recipe-detail-main">
          <div className="section-inner">
            <nav className="breadcrumb">
              <Link href="/recipes">Recipes</Link> → Not found
            </nav>
            <p style={{ color: 'var(--text-muted)', padding: '40px 0' }}>
              Recipe not found.{' '}
              <Link href="/recipes" style={{ color: 'var(--text)' }}>Browse all recipes →</Link>
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <main className="recipe-detail-main">
        <div className="section-inner">

          <nav className="breadcrumb">
            <Link href="/recipes">Recipes</Link> → {recipe.name}
          </nav>

          <div className="recipe-hero">
            <span className="recipe-hero-emoji">{PROTO_EMOJI[recipe.proto] ?? '🍴'}</span>
            <div className="recipe-hero-overlay">
              <span className="recipe-card-type-tag">
                {TYPE_LABEL[recipe.type] ?? recipe.type}
              </span>
              <h1 className="recipe-hero-name">{recipe.name}</h1>
            </div>
          </div>

          <div className="recipe-detail-layout">

            <div className="recipe-detail-left">
              <section>
                <h2>Ingredients</h2>
                <ul className="recipe-ingredients-list">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i} className="recipe-ingredient-row">
                      <span className="ing-qty">{ing.quantity}</span>
                      <span className="ing-name">{ing.item}</span>
                      <a
                        href={`https://www.walmart.com/search?q=${encodeURIComponent(ing.item)}`}
                        className="walmart-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        🛒 Walmart
                      </a>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2>Instructions</h2>
                <ol className="recipe-steps-list">
                  {recipe.steps.map(s => (
                    <li key={s.step} className="recipe-step">
                      <span className="step-num-badge">{s.step}</span>
                      <strong className="step-title">{s.title}</strong>
                      <p className="step-body">{s.instruction}</p>
                    </li>
                  ))}
                </ol>
              </section>
            </div>

            <aside className="recipe-detail-right">
              <div className="recipe-macro-card">
                <div className="stat-cell">
                  <div className="stat-val">{recipe.cal}</div>
                  <div className="stat-lbl">Calories</div>
                </div>
                <div className="stat-cell">
                  <div className="stat-val">{recipe.pro}g</div>
                  <div className="stat-lbl">Protein</div>
                </div>
                <div className="stat-cell">
                  <div className="stat-val">{recipe.carb}g</div>
                  <div className="stat-lbl">Carbs</div>
                </div>
                <div className="stat-cell">
                  <div className="stat-val">{recipe.fat}g</div>
                  <div className="stat-lbl">Fat</div>
                </div>
              </div>

              <div className="recipe-meta-row">
                <span>⏱ {recipe.totalTime} min</span>
                <span>· {recipe.servings} serving</span>
                <span>· ~${recipe.cost}</span>
              </div>

              {recipe.tips && (
                <blockquote className="recipe-tips">{recipe.tips}</blockquote>
              )}

              <Link href="/" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Add to meal plan →
              </Link>
            </aside>

          </div>
        </div>
      </main>
    </>
  );
}

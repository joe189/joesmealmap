export type CategoryRecipe = {
  slug: string;
  name: string;
  type: string;
  proto: string;
  cal: number;
  pro: number;
  carb: number;
  fat: number;
  totalTime: number;
  description: string;
  cost: number;
};

export type Category = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  filter: (recipe: CategoryRecipe) => boolean;
};

export const CATEGORIES: Category[] = [
  {
    slug: 'high-protein-breakfasts',
    title: 'High Protein Breakfasts',
    description:
      'Start your day strong with breakfasts that hit 25g+ of protein. Every recipe includes macros, ingredients, and step-by-step instructions.',
    eyebrow: 'Morning fuel',
    filter: r => r.type === 'breakfast' && r.pro >= 25,
  },
  {
    slug: 'high-protein-snacks',
    title: 'High Protein Snacks',
    description:
      'Smart snacks that keep you on track. 15g+ protein, macro-tracked, and actually worth eating.',
    eyebrow: 'Between meals',
    filter: r => r.type === 'snack' && r.pro >= 15,
  },
  {
    slug: 'meal-prep-recipes',
    title: 'Meal Prep Recipes',
    description:
      'Batch-friendly recipes that work all week. High protein, macro-tracked, and designed for efficient prep.',
    eyebrow: 'Prep once, eat all week',
    filter: r => r.pro >= 30,
  },
  {
    slug: 'under-500-calorie-meals',
    title: 'Under 500 Calorie Meals',
    description:
      'Full meals under 500 calories that still hit your protein targets. Great for fat loss and body recomp.',
    eyebrow: 'Lean eating',
    filter: r => r.cal < 500,
  },
  {
    slug: 'high-protein-dinners',
    title: 'High Protein Dinners',
    description:
      'Dinners built around your macro targets. 30g+ protein, full ingredients, and step-by-step instructions.',
    eyebrow: 'Evening meals',
    filter: r => r.type === 'dinner' && r.pro >= 30,
  },
];

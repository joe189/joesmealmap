import { writeFileSync } from 'fs';
import { MEALS as ORIGINAL_MEALS } from '../lib/meals';
import recipesRaw from '../lib/recipes-merged.json';
import newRecipesRaw from '../new-recipes.json';

// ── Types for recipes-merged.json (original 100) ──────────────────────────────
type RecipeJson = {
  slug: string;
  name: string;
  type: string;
  prepTime: number;
  cookTime: number;
  totalTime: number;
  servings: number;
  description: string;
  photoSearch: string;
  ingredients: { item: string; quantity: string }[];
  steps: { step: number; title: string; instruction: string }[];
  tips: string;
  proto: string;
  cal: number;
  pro: number;
  carb: number;
  fat: number;
  cost: number;
};

// ── Types for new-recipes.json (new 100) ──────────────────────────────────────
type NewRecipeJson = {
  slug: string;
  name: string;
  type: string;
  prepTime: number;
  cookTime: number;
  totalTime: number;
  servings: number;
  description: string;
  photoSearch: string;
  ingredients: { item: string; quantity: string }[];
  steps: { step: number; title: string; instruction: string }[];
  tips: string;
  proto: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  cost: number;
  seoDescription: string;
  tags: string[];
  shopping: Record<string, { name: string; qty: string; price: number }[]>;
};

const origRecipes = recipesRaw as RecipeJson[];
const newRecipes  = newRecipesRaw as NewRecipeJson[];

// Build lookup for original recipes by name
const origByName = new Map(origRecipes.map(r => [r.name, r]));

// Verify all original meals have a matching recipe entry
const mismatches: string[] = [];
for (const meal of ORIGINAL_MEALS) {
  if (!origByName.has(meal.name)) mismatches.push(meal.name);
}
if (mismatches.length > 0) {
  console.error('No JSON match for original meals:', mismatches);
  process.exit(1);
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function q(s: string): string {
  return JSON.stringify(s);
}

function renderShoppingItem(item: { name: string; qty: string; price: number }): string {
  return `{name:${q(item.name)},qty:${q(item.qty)},price:${item.price}}`;
}

function renderShopping(shopping: Record<string, { name: string; qty: string; price: number }[]>): string {
  const cats = Object.entries(shopping)
    .filter(([, items]) => items.length > 0)  // drop empty category arrays
    .map(([cat, items]) => `${cat}:[${items.map(renderShoppingItem).join(',')}]`);
  return `{${cats.join(',')}}`;
}

function renderIngredient(ing: { item: string; quantity: string }): string {
  return `{item:${q(ing.item)},quantity:${q(ing.quantity)}}`;
}

function renderStep(s: { step: number; title: string; instruction: string }): string {
  return `{step:${s.step},title:${q(s.title)},instruction:${q(s.instruction)}}`;
}

// ── Unified entry shape used when building the file ───────────────────────────
type Entry = {
  type: string;
  name: string;
  proto: string;
  cal: number;
  pro: number;
  carb: number;
  fat: number;
  cost: number;
  desc: string;
  tags: string[];
  shopping: Record<string, { name: string; qty: string; price: number }[]>;
  slug: string;
  prepTime: number;
  cookTime: number;
  totalTime: number;
  servings: number;
  description: string;
  photoSearch: string;
  ingredients: { item: string; quantity: string }[];
  steps: { step: number; title: string; instruction: string }[];
  tips: string;
  seoDescription?: string;
};

// Build unified entry list: originals first, then new recipes
const entries: Entry[] = [];

for (const meal of ORIGINAL_MEALS) {
  const r = origByName.get(meal.name)!;
  entries.push({
    type: meal.type,
    name: meal.name,
    proto: meal.proto,
    cal: meal.cal,
    pro: meal.pro,
    carb: meal.carb,
    fat: meal.fat,
    cost: meal.cost,
    desc: meal.desc,
    tags: meal.tags,
    shopping: meal.shopping as Record<string, { name: string; qty: string; price: number }[]>,
    slug: r.slug,
    prepTime: r.prepTime,
    cookTime: r.cookTime,
    totalTime: r.totalTime,
    servings: r.servings,
    description: r.description,
    photoSearch: r.photoSearch,
    ingredients: r.ingredients,
    steps: r.steps,
    tips: r.tips,
  });
}

for (const r of newRecipes) {
  entries.push({
    type: r.type,
    name: r.name,
    proto: r.proto,
    cal: r.calories,
    pro: r.protein,
    carb: r.carbs,
    fat: r.fat,
    cost: r.cost,
    desc: r.description,   // new recipes have no separate short desc — use description
    tags: r.tags,
    shopping: r.shopping,
    slug: r.slug,
    prepTime: r.prepTime,
    cookTime: r.cookTime,
    totalTime: r.totalTime,
    servings: r.servings,
    description: r.description,
    photoSearch: r.photoSearch,
    ingredients: r.ingredients,
    steps: r.steps,
    tips: r.tips,
    seoDescription: r.seoDescription,
  });
}

// ── Count by type for headers ─────────────────────────────────────────────────
const countByType = new Map<string, number>();
for (const e of entries) countByType.set(e.type, (countByType.get(e.type) ?? 0) + 1);

const typeOrder = ['breakfast', 'lunch', 'dinner', 'snack'];
const typeLabel: Record<string, string> = {
  breakfast: `BREAKFAST (${countByType.get('breakfast') ?? 0})`,
  lunch:     `LUNCH (${countByType.get('lunch') ?? 0})`,
  dinner:    `DINNER (${countByType.get('dinner') ?? 0})`,
  snack:     `MEAL 3 — lighter protein hits (${countByType.get('snack') ?? 0})`,
};

// ── Build file ────────────────────────────────────────────────────────────────
const lines: string[] = [];

lines.push(`// AUTO-GENERATED by scripts/generate-meals-data.ts — do not edit by hand`);
lines.push(`// Sources: lib/meals.ts + lib/recipes-merged.json + new-recipes.json`);
lines.push(``);
lines.push(`export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';`);
lines.push(`export type ProtoType = 'chicken' | 'beef' | 'pork' | 'eggs' | 'fish' | 'legumes' | 'yogurt' | 'tofu';`);
lines.push(`export type ShoppingCategory = 'Meat' | 'Produce' | 'Dairy' | 'Pantry';`);
lines.push(``);
lines.push(`export interface ShoppingItem {`);
lines.push(`  name: string;`);
lines.push(`  qty: string;`);
lines.push(`  price: number;`);
lines.push(`}`);
lines.push(``);
lines.push(`export interface Ingredient {`);
lines.push(`  item: string;`);
lines.push(`  quantity: string;`);
lines.push(`}`);
lines.push(``);
lines.push(`export interface RecipeStep {`);
lines.push(`  step: number;`);
lines.push(`  title: string;`);
lines.push(`  instruction: string;`);
lines.push(`}`);
lines.push(``);
lines.push(`export interface MealData {`);
lines.push(`  type: MealType;`);
lines.push(`  name: string;`);
lines.push(`  proto: ProtoType;`);
lines.push(`  cal: number;`);
lines.push(`  pro: number;`);
lines.push(`  carb: number;`);
lines.push(`  fat: number;`);
lines.push(`  cost: number;`);
lines.push(`  desc: string;`);
lines.push(`  tags: string[];`);
lines.push(`  shopping: Partial<Record<ShoppingCategory, ShoppingItem[]>>;`);
lines.push(`  slug: string;`);
lines.push(`  prepTime: number;`);
lines.push(`  cookTime: number;`);
lines.push(`  totalTime: number;`);
lines.push(`  servings: number;`);
lines.push(`  description: string;`);
lines.push(`  photoSearch: string;`);
lines.push(`  ingredients: Ingredient[];`);
lines.push(`  steps: RecipeStep[];`);
lines.push(`  tips: string;`);
lines.push(`  seoDescription?: string;`);
lines.push(`}`);
lines.push(``);
lines.push(`export const MEALS: MealData[] = [`);
lines.push(``);

for (const mealType of typeOrder) {
  const group = entries.filter(e => e.type === mealType);
  if (group.length === 0) continue;

  lines.push(`// ${'═'.repeat(40)}`);
  lines.push(`// ${typeLabel[mealType]}`);
  lines.push(`// ${'═'.repeat(40)}`);

  for (const e of group) {
    const tagsStr        = `[${e.tags.map(q).join(',')}]`;
    const shoppingStr    = renderShopping(e.shopping);
    const ingredientsStr = `[${e.ingredients.map(renderIngredient).join(',')}]`;
    const stepsStr       = `[${e.steps.map(renderStep).join(',')}]`;

    lines.push(`{`);
    lines.push(`  type:${q(e.type)},name:${q(e.name)},proto:${q(e.proto)},`);
    lines.push(`  cal:${e.cal},pro:${e.pro},carb:${e.carb},fat:${e.fat},cost:${e.cost},`);
    lines.push(`  desc:${q(e.desc)},`);
    lines.push(`  tags:${tagsStr},`);
    lines.push(`  shopping:${shoppingStr},`);
    lines.push(`  slug:${q(e.slug)},`);
    lines.push(`  prepTime:${e.prepTime},cookTime:${e.cookTime},totalTime:${e.totalTime},servings:${e.servings},`);
    lines.push(`  description:${q(e.description)},`);
    lines.push(`  photoSearch:${q(e.photoSearch)},`);
    lines.push(`  ingredients:${ingredientsStr},`);
    lines.push(`  steps:${stepsStr},`);
    lines.push(`  tips:${q(e.tips)},`);
    if (e.seoDescription) lines.push(`  seoDescription:${q(e.seoDescription)},`);
    lines.push(`},`);
    lines.push(``);
  }
}

lines.push(`];`);
lines.push(``);
lines.push(`// Backwards-compat alias so existing imports of \`Meal\` keep working`);
lines.push(`export type Meal = MealData;`);
lines.push(``);

const output = lines.join('\n');
writeFileSync('lib/meals-data.ts', output);
console.log(`Written lib/meals-data.ts (${entries.length} meals: ${ORIGINAL_MEALS.length} original + ${newRecipes.length} new)`);

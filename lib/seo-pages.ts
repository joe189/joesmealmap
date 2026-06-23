import { MEALS, type MealData } from './meals-data';

export type SeoPageConfig = {
  slug: string;
  title: string;
  metaDescription: string;
  canonical: string;
  h1: string;
  eyebrow: string;
  intro: string;
  faq: { q: string; a: string }[];
  navTitle: string;
  getRecipes: () => MealData[];
};

export const SEO_PAGES: SeoPageConfig[] = [
  {
    slug: 'high-protein-breakfast-recipes',
    title: '55 High Protein Breakfast Recipes for Muscle Growth',
    metaDescription:
      'Start your morning with breakfasts that actually hit your protein goals. 55 recipes with macros, full ingredients, and step-by-step instructions.',
    canonical: '/high-protein-breakfast-recipes',
    h1: '55 High Protein Breakfast Recipes for Muscle Growth',
    eyebrow: 'Morning fuel',
    intro:
      "Most breakfasts leave you hungry by 10am. These don't. Every recipe here is built around a solid protein anchor — eggs, Greek yogurt, turkey — with the macros tracked so you know exactly what you're getting. Whether you've got 5 minutes or 20, there's something here that works.",
    faq: [
      {
        q: 'How much protein should breakfast have?',
        a: "Aim for at least 25–30g. That's enough to trigger muscle protein synthesis and keep you full well past lunch. Most of these recipes land in that range or higher.",
      },
      {
        q: 'Can I meal prep these breakfasts?',
        a: "Most of them, yeah. Overnight oats, egg muffins, and protein bowls all hold up great in the fridge for 3–4 days. Just prep Sunday night and grab-and-go all week.",
      },
      {
        q: "What's the easiest high protein breakfast?",
        a: "Greek yogurt with some berries and granola. Takes literally 3 minutes, hits 30g+ protein, and you don't have to turn on the stove.",
      },
    ],
    navTitle: 'High Protein Breakfasts',
    getRecipes: () =>
      MEALS.filter(r => r.type === 'breakfast').sort((a, b) => b.pro - a.pro),
  },
  {
    slug: 'high-protein-lunch-recipes',
    title: '25+ High Protein Lunch Recipes to Stay Full All Afternoon',
    metaDescription:
      'Skip the sad desk salad. These high protein lunches keep you full and on track — all with macros and step-by-step instructions.',
    canonical: '/high-protein-lunch-recipes',
    h1: '25+ High Protein Lunch Recipes to Stay Full All Afternoon',
    eyebrow: 'Midday fuel',
    intro:
      "Lunch is where a lot of people fall off. You're busy, you grab whatever's convenient, and then you're starving again by 3pm. These recipes fix that. They're high in protein, fast to make, and easy enough to prep ahead so you're never stuck without a solid option.",
    faq: [
      {
        q: "What's a good amount of protein for lunch?",
        a: 'Shoot for 30–40g. That sweet spot keeps you satisfied through the afternoon without overeating at dinner.',
      },
      {
        q: 'Can I prep these lunches for the whole week?',
        a: "Absolutely. Most of these hold up 4–5 days in the fridge. Cook a big batch of protein on Sunday and mix and match with different sides all week.",
      },
      {
        q: "What's the highest protein lunch option?",
        a: "Anything built around chicken breast or canned tuna will get you there fastest. Look for recipes with 40g+ in the protein macro tag.",
      },
    ],
    navTitle: 'High Protein Lunches',
    getRecipes: () =>
      MEALS.filter(r => r.type === 'lunch').sort((a, b) => b.pro - a.pro),
  },
  {
    slug: 'high-protein-dinner-recipes',
    title: '30+ High Protein Dinner Recipes That Actually Fill You Up',
    metaDescription:
      'End the day strong. These high protein dinners hit 30g+ protein per serving with full macros, ingredients, and instructions.',
    canonical: '/high-protein-dinner-recipes',
    h1: '30+ High Protein Dinner Recipes That Actually Fill You Up',
    eyebrow: 'Evening meals',
    intro:
      "Dinner is your best shot at a high protein meal — you've got more time to cook and more room in your macros. These are the recipes I actually make on weeknights. Good protein, reasonable calories, and nothing that takes an hour to clean up after.",
    faq: [
      {
        q: 'How much protein should dinner have?',
        a: "Aim for 35–50g if you're serious about muscle growth. Dinner is usually your largest meal, so it's a great opportunity to hit a big chunk of your daily protein target.",
      },
      {
        q: "What's the fastest high protein dinner?",
        a: "Anything with chicken breast or ground turkey — they cook fast. Stir fries and sheet pan meals usually take under 25 minutes.",
      },
      {
        q: 'Are these dinners good for weight loss too?',
        a: "Yes. High protein meals keep you full and help preserve muscle while you're in a deficit. A lot of these are under 500 calories while still hitting 35g+ protein.",
      },
    ],
    navTitle: 'High Protein Dinners',
    getRecipes: () =>
      MEALS.filter(r => r.type === 'dinner').sort((a, b) => b.pro - a.pro),
  },
  {
    slug: 'high-protein-snacks',
    title: '20+ High Protein Snacks to Hit Your Macros Between Meals',
    metaDescription:
      'Smart snacks that actually move the needle. 20+ high protein options with macros, ingredients, and instructions.',
    canonical: '/high-protein-snacks',
    h1: '20+ High Protein Snacks to Hit Your Macros Between Meals',
    eyebrow: 'Between meals',
    intro:
      "A good snack isn't just something to hold you over — it's a chance to stack another 15–20g of protein into your day without adding a ton of calories. These are the snacks that actually do that. No empty snacking, no protein bar mediocrity — just real food that keeps you on track.",
    faq: [
      {
        q: 'How much protein should a snack have?',
        a: "Try to hit at least 10–15g. Anything less and it's not doing much from a muscle-building standpoint. A lot of these hit 15–20g.",
      },
      {
        q: "What's the easiest high protein snack to prep?",
        a: "Hard boiled eggs or Greek yogurt. Both take almost zero effort and you can batch them for the whole week.",
      },
      {
        q: 'Can I eat these snacks before a workout?',
        a: "Yeah, most of these work great as pre-workout fuel. Something lighter like a yogurt bowl or cottage cheese is easy on the stomach. Save the heavier stuff for after.",
      },
    ],
    navTitle: 'High Protein Snacks',
    getRecipes: () =>
      MEALS.filter(r => r.type === 'snack').sort((a, b) => b.pro - a.pro),
  },
  {
    slug: 'high-protein-meal-prep',
    title: '48 High Protein Meal Prep Recipes to Batch Cook for the Week',
    metaDescription:
      'Stop winging it every day. These meal prep recipes are high in protein, easy to batch, and built to last all week.',
    canonical: '/high-protein-meal-prep',
    h1: '48 High Protein Meal Prep Recipes to Batch Cook for the Week',
    eyebrow: 'Prep once, eat all week',
    intro:
      "Meal prep is the single biggest thing that makes hitting your protein goals feel easy instead of exhausting. These are the recipes that hold up well in the fridge, reheat without turning into rubber, and actually taste good on day four. Pick a few, block out two hours Sunday, and you're set.",
    faq: [
      {
        q: 'How many meals should I prep at a time?',
        a: "Most people find 3–5 days worth manageable. Any more and food starts to taste old and you lose motivation. Pick 2–3 recipes, make a big batch of each, and rotate through.",
      },
      {
        q: 'How long do meal prepped meals last in the fridge?',
        a: "Most cooked proteins and grains last 4–5 days. Fish is usually best within 2–3 days. If you're prepping for the full week, consider freezing half.",
      },
      {
        q: 'Do I need special containers for meal prep?',
        a: "Glass containers with snap lids are worth it — they microwave better than plastic and don't absorb smells. A set of 10 runs about $25 and will last years.",
      },
    ],
    navTitle: 'High Protein Meal Prep',
    getRecipes: () =>
      MEALS.filter(r => r.type !== 'dessert')
        .sort((a, b) => b.pro - a.pro)
        .slice(0, 48),
  },
  {
    slug: 'high-protein-chicken-recipes',
    title: '30+ High Protein Chicken Recipes for Muscle Building',
    metaDescription:
      'Chicken is king for a reason. 30+ high protein chicken recipes with macros, ingredients, and step-by-step instructions.',
    canonical: '/high-protein-chicken-recipes',
    h1: '30+ High Protein Chicken Recipes for Muscle Building',
    eyebrow: 'Chicken, every way',
    intro:
      "Chicken breast is the most efficient protein source going — lean, versatile, affordable, and easy to cook in bulk. The problem is most people cook it the same boring way every week. These recipes fix that. Same macros, totally different flavor profiles, so you never get sick of it.",
    faq: [
      {
        q: 'How much protein is in chicken breast?',
        a: "About 31g per 100g of cooked chicken breast. A typical 6oz serving gives you roughly 53g of protein for around 280 calories. It's hard to beat for muscle building.",
      },
      {
        q: "What's the best way to cook chicken for meal prep?",
        a: "Baking or batch poaching. Both are hands-off, cook evenly, and stay moist when stored properly. Season before cooking and don't skip the rest time after it comes out of the oven.",
      },
      {
        q: 'Can I freeze cooked chicken?',
        a: "Absolutely. Cooked chicken freezes great for up to 3 months. Slice or shred it before freezing so it reheats faster and more evenly.",
      },
    ],
    navTitle: 'High Protein Chicken',
    getRecipes: () =>
      MEALS.filter(r => r.proto === 'chicken').sort((a, b) => b.pro - a.pro),
  },
  {
    slug: 'low-carb-high-protein-recipes',
    title: '25+ Low Carb High Protein Recipes Under 30g Carbs',
    metaDescription:
      'High protein, low carb, actually delicious. 25+ recipes under 30g carbs with macros, ingredients, and full instructions.',
    canonical: '/low-carb-high-protein-recipes',
    h1: '25+ Low Carb High Protein Recipes Under 30g Carbs',
    eyebrow: 'Lean and mean',
    intro:
      "Whether you're cutting, doing keto, or just watching carbs, these recipes hit the sweet spot — low enough in carbs to stay in the zone, high enough in protein to hold your muscle. None of them taste like diet food.",
    faq: [
      {
        q: 'What counts as low carb?',
        a: "This page uses under 30g of net carbs per serving as the threshold. That puts you in a moderate low-carb range that works for both keto and general carb reduction.",
      },
      {
        q: 'Is low carb and high protein the same as keto?',
        a: "Not exactly. Keto is specifically very low carb (usually under 20g/day) with high fat. Low carb high protein is more flexible and doesn't require tracking fat as closely. Both can work for fat loss.",
      },
      {
        q: 'Will I feel tired eating low carb?',
        a: "For the first week or two, maybe. Once your body adapts, most people report steadier energy than they had with high carb eating. Make sure you're getting enough sodium and electrolytes early on.",
      },
    ],
    navTitle: 'Low Carb High Protein',
    getRecipes: () =>
      MEALS.filter(r => r.carb <= 30 && r.type !== 'dessert').sort(
        (a, b) => b.pro - a.pro,
      ),
  },
  {
    slug: 'high-protein-vegetarian-recipes',
    title: '20+ High Protein Vegetarian Recipes That Actually Hit Your Goals',
    metaDescription:
      "Plant-based doesn't mean low protein. 20+ vegetarian recipes with 20g+ protein per serving, macros included.",
    canonical: '/high-protein-vegetarian-recipes',
    h1: '20+ High Protein Vegetarian Recipes That Actually Hit Your Goals',
    eyebrow: 'Plant-based protein',
    intro:
      "Getting enough protein without meat is totally doable — you just have to be intentional about it. Eggs, Greek yogurt, legumes, and tofu are the workhorses here, and when you build meals around them properly, the protein adds up fast. These recipes prove you don't need chicken breast to hit your numbers.",
    faq: [
      {
        q: 'How do vegetarians get enough protein?',
        a: "By centering meals around complete protein sources like eggs and Greek yogurt, and combining legumes with grains to get all the essential amino acids. It takes a bit more planning than grabbing chicken, but it's absolutely doable.",
      },
      {
        q: 'Is vegetarian protein as good as meat protein?',
        a: "For muscle building, animal proteins like eggs and dairy are very close to meat in terms of bioavailability. Plant proteins like legumes are slightly lower, but eating a variety covers your bases.",
      },
      {
        q: 'How much protein can I realistically get on a vegetarian diet?',
        a: "Plenty. If you're eating eggs, Greek yogurt, cottage cheese, and legumes regularly, hitting 150g+ per day is very realistic without any supplements.",
      },
    ],
    navTitle: 'High Protein Vegetarian',
    getRecipes: () =>
      MEALS.filter(r =>
        ['eggs', 'legumes', 'yogurt', 'tofu'].includes(r.proto),
      ).sort((a, b) => b.pro - a.pro),
  },
];

export function getSeoPage(slug: string): SeoPageConfig | undefined {
  return SEO_PAGES.find(p => p.slug === slug);
}

export const SEO_PAGE_LINKS = SEO_PAGES.map(p => ({
  slug: p.slug,
  navTitle: p.navTitle,
  canonical: p.canonical,
}));

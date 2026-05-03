export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'meal3';
export type ProtoType = 'chicken' | 'beef' | 'pork' | 'eggs' | 'fish' | 'legumes' | 'yogurt' | 'tofu';
export type ShoppingCategory = 'Meat' | 'Produce' | 'Dairy' | 'Pantry';

export interface ShoppingItem {
  name: string;
  qty: string;
  price: number;
}

export interface Meal {
  type: MealType;
  name: string;
  proto: ProtoType;
  cal: number;
  pro: number;
  carb: number;
  fat: number;
  cost: number;
  desc: string;
  tags: string[];
  shopping: Partial<Record<ShoppingCategory, ShoppingItem[]>>;
}

export const MEALS: Meal[] = [

// ════════════════════════════════════════
// BREAKFAST (30)
// ════════════════════════════════════════
{type:'breakfast',name:'Greek yogurt & berry bowl',proto:'yogurt',cal:340,pro:32,carb:36,fat:6,cost:4,desc:'Greek yogurt, mixed berries, honey, granola, chia seeds',tags:['vegetarian','dairy'],
 shopping:{Produce:[{name:'Mixed berries',qty:'2 pints',price:7}],Dairy:[{name:'Greek yogurt',qty:'2 large tubs',price:9}],Pantry:[{name:'Granola',qty:'1 bag',price:5},{name:'Honey',qty:'12 oz bottle',price:4},{name:'Chia seeds',qty:'1 bag',price:4}]}},

{type:'breakfast',name:'Scrambled eggs & turkey',proto:'eggs',cal:380,pro:36,carb:12,fat:18,cost:5,desc:'Scrambled eggs, ground turkey, spinach, whole grain toast',tags:['meat','eggs','gluten'],
 shopping:{Produce:[{name:'Baby spinach',qty:'1 bag',price:3}],Meat:[{name:'Ground turkey',qty:'1 lb',price:6}],Dairy:[{name:'Eggs',qty:'12-pack',price:5}],Pantry:[{name:'Whole grain bread',qty:'1 loaf',price:4}]}},

{type:'breakfast',name:'Overnight oats',proto:'yogurt',cal:420,pro:22,carb:58,fat:10,cost:3,desc:'Rolled oats, almond milk, banana, peanut butter, chia seeds',tags:['vegetarian','vegan','nuts','gluten'],
 shopping:{Produce:[{name:'Bananas',qty:'1 bunch',price:2}],Pantry:[{name:'Rolled oats',qty:'18 oz canister',price:3},{name:'Almond milk',qty:'half gallon',price:4},{name:'Peanut butter',qty:'16 oz jar',price:4},{name:'Chia seeds',qty:'1 bag',price:4}]}},

{type:'breakfast',name:'Protein pancakes',proto:'eggs',cal:390,pro:34,carb:38,fat:10,cost:4,desc:'Protein powder pancakes with fresh berries and maple syrup',tags:['vegetarian','eggs','dairy','gluten'],
 shopping:{Produce:[{name:'Mixed berries',qty:'1 pint',price:4}],Dairy:[{name:'Eggs',qty:'12-pack',price:5}],Pantry:[{name:'Protein powder',qty:'1 scoop',price:3},{name:'Oat flour',qty:'2 lb bag',price:3},{name:'Maple syrup',qty:'12 oz bottle',price:4}]}},

{type:'breakfast',name:'Egg white omelette',proto:'eggs',cal:280,pro:30,carb:10,fat:8,cost:4,desc:'Egg whites, mushrooms, bell peppers, onion, side of fruit',tags:['vegetarian','eggs'],
 shopping:{Produce:[{name:'Mushrooms',qty:'1 pack',price:3},{name:'Bell peppers',qty:'2',price:2},{name:'Onion',qty:'1',price:1},{name:'Banana',qty:'2',price:1}],Dairy:[{name:'Egg whites',qty:'1 carton',price:4}]}},

{type:'breakfast',name:'Cottage cheese & fruit',proto:'yogurt',cal:310,pro:28,carb:30,fat:6,cost:4,desc:'Cottage cheese, sliced peaches or pineapple, walnuts, honey',tags:['vegetarian','dairy','nuts'],
 shopping:{Produce:[{name:'Peaches or pineapple chunks',qty:'15 oz can',price:3}],Dairy:[{name:'Cottage cheese',qty:'2 tubs',price:7}],Pantry:[{name:'Walnuts',qty:'8 oz bag',price:5},{name:'Honey',qty:'12 oz bottle',price:4}]}},

{type:'breakfast',name:'Avocado & egg toast',proto:'eggs',cal:420,pro:20,carb:36,fat:22,cost:5,desc:'Whole grain toast, mashed avocado, fried eggs, red pepper flakes',tags:['vegetarian','eggs','gluten'],
 shopping:{Produce:[{name:'Avocado',qty:'3',price:5}],Dairy:[{name:'Eggs',qty:'12-pack',price:5}],Pantry:[{name:'Whole grain bread',qty:'1 loaf',price:4},{name:'Red pepper flakes',qty:'1 jar',price:2}]}},

{type:'breakfast',name:'Smoothie bowl',proto:'yogurt',cal:360,pro:28,carb:44,fat:7,cost:5,desc:'Frozen mango, banana, Greek yogurt, protein powder, granola topping',tags:['vegetarian','dairy'],
 shopping:{Produce:[{name:'Frozen mango',qty:'1 bag',price:4},{name:'Bananas',qty:'1 bunch',price:2}],Dairy:[{name:'Greek yogurt',qty:'1 large tub',price:5}],Pantry:[{name:'Protein powder',qty:'1 scoop',price:3},{name:'Granola',qty:'1 bag',price:5}]}},

{type:'breakfast',name:'Turkey & egg breakfast bowl',proto:'eggs',cal:410,pro:38,carb:22,fat:16,cost:6,desc:'Ground turkey, scrambled eggs, roasted sweet potato, salsa',tags:['meat','eggs'],
 shopping:{Produce:[{name:'Sweet potatoes',qty:'2',price:2}],Meat:[{name:'Ground turkey',qty:'1 lb',price:6}],Dairy:[{name:'Eggs',qty:'12-pack',price:5}],Pantry:[{name:'Salsa',qty:'16 oz jar',price:3}]}},

{type:'breakfast',name:'Peanut butter oat bowl',proto:'yogurt',cal:440,pro:20,carb:54,fat:14,cost:3,desc:'Oats, peanut butter, banana, honey, a scoop of protein powder',tags:['vegetarian','vegan','nuts','gluten'],
 shopping:{Produce:[{name:'Bananas',qty:'1 bunch',price:2}],Pantry:[{name:'Rolled oats',qty:'18 oz canister',price:3},{name:'Peanut butter',qty:'16 oz jar',price:4},{name:'Honey',qty:'12 oz bottle',price:4},{name:'Protein powder',qty:'1 scoop',price:3}]}},

{type:'breakfast',name:'Salmon & egg scramble',proto:'fish',cal:390,pro:38,carb:8,fat:22,cost:7,desc:'Smoked salmon, scrambled eggs, cream cheese on whole grain toast',tags:['meat','seafood','eggs','dairy','gluten'],
 shopping:{Meat:[{name:'Smoked salmon',qty:'1 pack',price:7}],Dairy:[{name:'Eggs',qty:'12-pack',price:5},{name:'Cream cheese',qty:'1 tub',price:4}],Pantry:[{name:'Whole grain bread',qty:'1 loaf',price:4}]}},

{type:'breakfast',name:'Tofu scramble',proto:'tofu',cal:320,pro:24,carb:22,fat:14,cost:4,desc:'Turmeric tofu scramble, black beans, salsa, whole grain toast',tags:['vegetarian','vegan','gluten'],
 shopping:{Produce:[{name:'Baby spinach',qty:'1 bag',price:3}],Pantry:[{name:'Firm tofu',qty:'1 block',price:3},{name:'Black beans',qty:'15 oz can',price:1},{name:'Salsa',qty:'16 oz jar',price:3},{name:'Whole grain bread',qty:'1 loaf',price:4},{name:'Turmeric',qty:'1 jar',price:3}]}},

{type:'breakfast',name:'Chicken sausage & eggs',proto:'chicken',cal:400,pro:36,carb:14,fat:20,cost:5,desc:'Chicken sausage links, 2 eggs any style, sauteed peppers and onions',tags:['meat','eggs'],
 shopping:{Produce:[{name:'Bell peppers',qty:'2',price:2},{name:'Onion',qty:'1',price:1}],Meat:[{name:'Chicken sausage links',qty:'1 pack',price:5}],Dairy:[{name:'Eggs',qty:'12-pack',price:5}]}},

{type:'breakfast',name:'High protein oatmeal',proto:'yogurt',cal:380,pro:30,carb:48,fat:8,cost:4,desc:'Oats cooked with protein powder, topped with banana and almond butter',tags:['vegetarian','nuts','gluten'],
 shopping:{Produce:[{name:'Bananas',qty:'1 bunch',price:2}],Pantry:[{name:'Rolled oats',qty:'18 oz canister',price:3},{name:'Protein powder',qty:'1 scoop',price:3},{name:'Almond butter',qty:'16 oz jar',price:6}]}},

{type:'breakfast',name:'Beef & egg skillet',proto:'beef',cal:430,pro:38,carb:12,fat:24,cost:6,desc:'Lean ground beef, eggs, diced potatoes, peppers, onion skillet',tags:['meat','eggs'],
 shopping:{Produce:[{name:'Potatoes',qty:'2',price:2},{name:'Bell peppers',qty:'2',price:2},{name:'Onion',qty:'1',price:1}],Meat:[{name:'Lean ground beef',qty:'1 lb',price:6}],Dairy:[{name:'Eggs',qty:'12-pack',price:5}]}},

{type:'breakfast',name:'Ricotta & berry toast',proto:'yogurt',cal:360,pro:22,carb:38,fat:12,cost:5,desc:'Whipped ricotta on sourdough, fresh strawberries, honey, almonds',tags:['vegetarian','dairy','gluten','nuts'],
 shopping:{Produce:[{name:'Strawberries',qty:'1 pint',price:4}],Dairy:[{name:'Ricotta',qty:'1 tub',price:4}],Pantry:[{name:'Sourdough bread',qty:'1 loaf',price:4},{name:'Honey',qty:'12 oz bottle',price:4},{name:'Sliced almonds',qty:'1 bag',price:4}]}},

{type:'breakfast',name:'Lentil breakfast bowl',proto:'legumes',cal:350,pro:22,carb:48,fat:6,cost:4,desc:'Warm spiced lentils, soft-boiled egg, avocado, hot sauce',tags:['vegetarian','eggs'],
 shopping:{Produce:[{name:'Avocado',qty:'2',price:3}],Dairy:[{name:'Eggs',qty:'12-pack',price:5}],Pantry:[{name:'Green lentils',qty:'1 lb bag',price:3},{name:'Cumin & paprika',qty:'1 jar each',price:4},{name:'Hot sauce',qty:'5 oz bottle',price:3}]}},

{type:'breakfast',name:'Pork sausage & egg muffins',proto:'pork',cal:380,pro:32,carb:10,fat:22,cost:5,desc:'Baked egg muffins with pork sausage, cheese, and bell pepper',tags:['meat','pork','eggs','dairy'],
 shopping:{Produce:[{name:'Bell peppers',qty:'2',price:2}],Meat:[{name:'Pork breakfast sausage',qty:'1 lb',price:5}],Dairy:[{name:'Eggs',qty:'12-pack',price:5},{name:'Shredded cheese',qty:'1 bag',price:4}]}},

{type:'breakfast',name:'Chickpea breakfast scramble',proto:'legumes',cal:340,pro:20,carb:40,fat:10,cost:4,desc:'Spiced chickpeas, spinach, tomatoes, whole grain toast',tags:['vegetarian','vegan','gluten'],
 shopping:{Produce:[{name:'Baby spinach',qty:'1 bag',price:3},{name:'Cherry tomatoes',qty:'1 pint',price:3}],Pantry:[{name:'Chickpeas',qty:'2 cans',price:3},{name:'Whole grain bread',qty:'1 loaf',price:4},{name:'Smoked paprika',qty:'1 jar',price:3}]}},

{type:'breakfast',name:'Yogurt parfait',proto:'yogurt',cal:320,pro:26,carb:38,fat:6,cost:4,desc:'Layered Greek yogurt, granola, blueberries, honey, flaxseed',tags:['vegetarian','dairy','gluten'],
 shopping:{Produce:[{name:'Blueberries',qty:'1 pint',price:4}],Dairy:[{name:'Greek yogurt',qty:'2 large tubs',price:9}],Pantry:[{name:'Granola',qty:'1 bag',price:5},{name:'Honey',qty:'12 oz bottle',price:4},{name:'Ground flaxseed',qty:'1 bag',price:4}]}},

{type:'breakfast',name:'Shrimp & egg scramble',proto:'fish',cal:360,pro:36,carb:10,fat:16,cost:6,desc:'Shrimp, scrambled eggs, avocado, hot sauce, corn tortillas',tags:['meat','seafood','eggs'],
 shopping:{Produce:[{name:'Avocado',qty:'2',price:3}],Meat:[{name:'Shrimp',qty:'1 lb',price:9}],Dairy:[{name:'Eggs',qty:'12-pack',price:5}],Pantry:[{name:'Corn tortillas',qty:'30-count pack',price:3},{name:'Hot sauce',qty:'5 oz bottle',price:3}]}},

{type:'breakfast',name:'Almond butter banana wrap',proto:'yogurt',cal:400,pro:18,carb:50,fat:14,cost:4,desc:'Whole wheat wrap, almond butter, sliced banana, honey, granola',tags:['vegetarian','vegan','nuts','gluten'],
 shopping:{Produce:[{name:'Bananas',qty:'1 bunch',price:2}],Pantry:[{name:'Whole wheat wraps',qty:'1 pack',price:3},{name:'Almond butter',qty:'16 oz jar',price:6},{name:'Honey',qty:'12 oz bottle',price:4},{name:'Granola',qty:'1 bag',price:5}]}},

{type:'breakfast',name:'Black bean breakfast bowl',proto:'legumes',cal:370,pro:22,carb:46,fat:10,cost:4,desc:'Black beans, scrambled eggs, salsa, avocado, corn tortillas',tags:['vegetarian','eggs'],
 shopping:{Produce:[{name:'Avocado',qty:'2',price:3}],Dairy:[{name:'Eggs',qty:'12-pack',price:5}],Pantry:[{name:'Black beans',qty:'2 cans',price:2},{name:'Salsa',qty:'16 oz jar',price:3},{name:'Corn tortillas',qty:'30-count pack',price:3}]}},

{type:'breakfast',name:'Tuna & avocado toast',proto:'fish',cal:380,pro:34,carb:28,fat:14,cost:4,desc:'Canned tuna mixed with avocado, lemon, on whole grain toast',tags:['meat','seafood','gluten'],
 shopping:{Produce:[{name:'Avocado',qty:'2',price:3},{name:'Lemon',qty:'1',price:1}],Meat:[{name:'Canned tuna',qty:'2 cans',price:4}],Pantry:[{name:'Whole grain bread',qty:'1 loaf',price:4}]}},

{type:'breakfast',name:'Beef & potato hash',proto:'beef',cal:440,pro:36,carb:34,fat:18,cost:6,desc:'Ground beef, diced potatoes, onion, peppers, topped with fried egg',tags:['meat','eggs'],
 shopping:{Produce:[{name:'Potatoes',qty:'3',price:2},{name:'Onion',qty:'1',price:1},{name:'Bell peppers',qty:'2',price:2}],Meat:[{name:'Lean ground beef',qty:'1 lb',price:6}],Dairy:[{name:'Eggs',qty:'12-pack',price:5}]}},

{type:'breakfast',name:'Tofu veggie bowl',proto:'tofu',cal:300,pro:22,carb:26,fat:12,cost:4,desc:'Baked tofu, roasted cherry tomatoes, spinach, brown rice, soy',tags:['vegetarian','vegan'],
 shopping:{Produce:[{name:'Cherry tomatoes',qty:'1 pint',price:3},{name:'Baby spinach',qty:'1 bag',price:3}],Pantry:[{name:'Firm tofu',qty:'1 block',price:3},{name:'Brown rice',qty:'2 lb bag',price:3},{name:'Soy sauce',qty:'10 oz bottle',price:3}]}},

{type:'breakfast',name:'Pork & apple oatmeal',proto:'pork',cal:410,pro:26,carb:50,fat:12,cost:5,desc:'Oatmeal topped with crumbled pork sausage, diced apple, cinnamon',tags:['meat','pork','gluten'],
 shopping:{Produce:[{name:'Apple',qty:'2',price:2}],Meat:[{name:'Pork breakfast sausage',qty:'1 lb',price:5}],Pantry:[{name:'Rolled oats',qty:'18 oz canister',price:3},{name:'Cinnamon',qty:'1 jar',price:2}]}},

{type:'breakfast',name:'Chicken & rice breakfast bowl',proto:'chicken',cal:420,pro:40,carb:38,fat:10,cost:6,desc:'Shredded chicken breast, brown rice, fried egg, avocado, hot sauce',tags:['meat','eggs'],
 shopping:{Produce:[{name:'Avocado',qty:'2',price:3}],Meat:[{name:'Chicken breasts',qty:'2',price:6}],Dairy:[{name:'Eggs',qty:'12-pack',price:5}],Pantry:[{name:'Brown rice',qty:'2 lb bag',price:3},{name:'Hot sauce',qty:'5 oz bottle',price:3}]}},

{type:'breakfast',name:'Edamame & egg bowl',proto:'legumes',cal:350,pro:28,carb:26,fat:14,cost:5,desc:'Steamed edamame, soft-boiled eggs, brown rice, soy sesame dressing',tags:['vegetarian','eggs'],
 shopping:{Produce:[{name:'Frozen edamame',qty:'1 bag',price:3}],Dairy:[{name:'Eggs',qty:'12-pack',price:5}],Pantry:[{name:'Brown rice',qty:'2 lb bag',price:3},{name:'Soy sauce',qty:'10 oz bottle',price:3},{name:'Sesame oil',qty:'8 oz bottle',price:4}]}},

{type:'breakfast',name:'Whey protein shake & oats',proto:'yogurt',cal:360,pro:36,carb:40,fat:6,cost:3,desc:'Protein shake with almond milk, banana, and a bowl of oats with honey',tags:['vegetarian','gluten'],
 shopping:{Produce:[{name:'Bananas',qty:'1 bunch',price:2}],Pantry:[{name:'Protein powder',qty:'1 scoop',price:3},{name:'Almond milk',qty:'half gallon',price:4},{name:'Rolled oats',qty:'18 oz canister',price:3},{name:'Honey',qty:'12 oz bottle',price:4}]}},

// ════════════════════════════════════════
// LUNCH (30)
// ════════════════════════════════════════
{type:'lunch',name:'Chicken Caesar salad',proto:'chicken',cal:480,pro:44,carb:20,fat:22,cost:7,desc:'Grilled chicken, romaine, parmesan, Caesar dressing, croutons',tags:['meat','dairy','gluten'],
 shopping:{Produce:[{name:'Romaine lettuce',qty:'2 heads',price:4},{name:'Lemon',qty:'1',price:1}],Meat:[{name:'Chicken breasts',qty:'2',price:6}],Dairy:[{name:'Parmesan',qty:'1 block',price:4}],Pantry:[{name:'Caesar dressing',qty:'1 bottle',price:3},{name:'Croutons',qty:'5 oz bag',price:3}]}},

{type:'lunch',name:'Turkey & avocado wrap',proto:'chicken',cal:460,pro:38,carb:38,fat:16,cost:6,desc:'Sliced turkey, avocado, lettuce, tomato, mustard in a whole wheat wrap',tags:['meat','gluten'],
 shopping:{Produce:[{name:'Avocado',qty:'3',price:5},{name:'Romaine lettuce',qty:'1 head',price:2},{name:'Tomatoes',qty:'2',price:2}],Meat:[{name:'Deli turkey',qty:'1 lb',price:6}],Pantry:[{name:'Whole wheat wraps',qty:'1 pack',price:3},{name:'Mustard',qty:'14 oz bottle',price:2}]}},

{type:'lunch',name:'Tuna salad on whole grain',proto:'fish',cal:440,pro:38,carb:32,fat:14,cost:5,desc:'Tuna mixed with Greek yogurt, celery, onion, on whole grain bread',tags:['meat','seafood','dairy','gluten'],
 shopping:{Produce:[{name:'Celery',qty:'1 bunch',price:2},{name:'Onion',qty:'1',price:1}],Meat:[{name:'Canned tuna',qty:'3 cans',price:5}],Dairy:[{name:'Greek yogurt',qty:'1 small tub',price:3}],Pantry:[{name:'Whole grain bread',qty:'1 loaf',price:4}]}},

{type:'lunch',name:'Beef taco salad',proto:'beef',cal:510,pro:42,carb:30,fat:22,cost:7,desc:'Seasoned ground beef, romaine, black beans, salsa, shredded cheese, lime',tags:['meat','dairy'],
 shopping:{Produce:[{name:'Romaine lettuce',qty:'1 head',price:2},{name:'Lime',qty:'2',price:1},{name:'Avocado',qty:'1',price:2}],Meat:[{name:'Lean ground beef',qty:'1 lb',price:6}],Dairy:[{name:'Shredded cheese',qty:'1 bag',price:4}],Pantry:[{name:'Black beans',qty:'15 oz can',price:1},{name:'Salsa',qty:'16 oz jar',price:3},{name:'Taco seasoning',qty:'1 pack',price:2}]}},

{type:'lunch',name:'Chicken rice bowl',proto:'chicken',cal:520,pro:46,carb:52,fat:10,cost:8,desc:'Grilled chicken breast, steamed brown rice, broccoli, soy glaze',tags:['meat'],
 shopping:{Produce:[{name:'Broccoli',qty:'1 head',price:2}],Meat:[{name:'Chicken breasts',qty:'2',price:6}],Pantry:[{name:'Brown rice',qty:'2 lb bag',price:3},{name:'Soy sauce',qty:'10 oz bottle',price:3}]}},

{type:'lunch',name:'Lentil soup & bread',proto:'legumes',cal:400,pro:22,carb:56,fat:6,cost:5,desc:'Chunky lentil soup with carrots, celery, tomatoes, sourdough bread',tags:['vegetarian','vegan','gluten'],
 shopping:{Produce:[{name:'Carrots',qty:'3',price:2},{name:'Celery',qty:'1 bunch',price:2},{name:'Onion',qty:'1',price:1}],Pantry:[{name:'Green lentils',qty:'1 lb bag',price:3},{name:'Diced tomatoes',qty:'14.5 oz can',price:2},{name:'Vegetable stock',qty:'32 oz carton',price:3},{name:'Sourdough bread',qty:'1 loaf',price:4}]}},

{type:'lunch',name:'Shrimp & avocado salad',proto:'fish',cal:420,pro:36,carb:18,fat:20,cost:8,desc:'Shrimp, avocado, cucumber, cherry tomatoes, lime citrus dressing',tags:['meat','seafood'],
 shopping:{Produce:[{name:'Avocado',qty:'2',price:3},{name:'Cucumber',qty:'1',price:1},{name:'Cherry tomatoes',qty:'1 pint',price:3},{name:'Lime',qty:'2',price:1}],Meat:[{name:'Shrimp',qty:'1 lb',price:9}]}},

{type:'lunch',name:'Egg salad sandwich',proto:'eggs',cal:430,pro:26,carb:36,fat:18,cost:4,desc:'Hard-boiled eggs, Greek yogurt mayo, celery, whole grain bread, lettuce',tags:['vegetarian','eggs','dairy','gluten'],
 shopping:{Produce:[{name:'Celery',qty:'1 bunch',price:2},{name:'Romaine lettuce',qty:'1 head',price:2}],Dairy:[{name:'Eggs',qty:'12-pack',price:5},{name:'Greek yogurt',qty:'1 small tub',price:3}],Pantry:[{name:'Whole grain bread',qty:'1 loaf',price:4},{name:'Mustard',qty:'14 oz bottle',price:2}]}},

{type:'lunch',name:'Black bean & veggie burrito',proto:'legumes',cal:480,pro:22,carb:64,fat:12,cost:5,desc:'Black beans, brown rice, peppers, onion, salsa, cheese in a whole wheat wrap',tags:['vegetarian','dairy','gluten'],
 shopping:{Produce:[{name:'Bell peppers',qty:'2',price:2},{name:'Onion',qty:'1',price:1},{name:'Avocado',qty:'1',price:2}],Dairy:[{name:'Shredded cheese',qty:'1 bag',price:4}],Pantry:[{name:'Black beans',qty:'2 cans',price:2},{name:'Brown rice',qty:'2 lb bag',price:3},{name:'Salsa',qty:'16 oz jar',price:3},{name:'Whole wheat wraps',qty:'1 pack',price:3}]}},

{type:'lunch',name:'Salmon & quinoa bowl',proto:'fish',cal:510,pro:44,carb:36,fat:18,cost:10,desc:'Baked salmon, quinoa, cucumber, avocado, lemon herb dressing',tags:['meat','seafood'],
 shopping:{Produce:[{name:'Avocado',qty:'2',price:3},{name:'Cucumber',qty:'1',price:1},{name:'Lemon',qty:'1',price:1}],Meat:[{name:'Salmon fillets',qty:'2',price:10}],Pantry:[{name:'Quinoa',qty:'1 lb bag',price:5},{name:'Olive oil',qty:'16 oz bottle',price:5}]}},

{type:'lunch',name:'Ground beef & rice bowl',proto:'beef',cal:530,pro:44,carb:48,fat:16,cost:7,desc:'Korean-style ground beef, steamed rice, cucumber, green onions, soy',tags:['meat'],
 shopping:{Produce:[{name:'Cucumber',qty:'1',price:1},{name:'Green onions',qty:'1 bunch',price:1},{name:'Garlic',qty:'1 bulb',price:1}],Meat:[{name:'Lean ground beef',qty:'1 lb',price:6}],Pantry:[{name:'White rice',qty:'2 lb bag',price:3},{name:'Soy sauce',qty:'10 oz bottle',price:3},{name:'Sesame oil',qty:'8 oz bottle',price:4}]}},

{type:'lunch',name:'Chicken & veggie soup',proto:'chicken',cal:360,pro:38,carb:30,fat:8,cost:6,desc:'Chicken breast chunks, carrots, celery, potatoes, chicken broth',tags:['meat'],
 shopping:{Produce:[{name:'Carrots',qty:'3',price:2},{name:'Celery',qty:'1 bunch',price:2},{name:'Potatoes',qty:'2',price:2},{name:'Onion',qty:'1',price:1}],Meat:[{name:'Chicken breasts',qty:'2',price:6}],Pantry:[{name:'Chicken stock',qty:'32 oz carton',price:3}]}},

{type:'lunch',name:'Tofu & veggie wrap',proto:'tofu',cal:400,pro:26,carb:42,fat:14,cost:5,desc:'Crispy tofu, shredded carrots, cucumber, hummus, whole wheat wrap',tags:['vegetarian','vegan','gluten'],
 shopping:{Produce:[{name:'Carrots',qty:'2',price:1},{name:'Cucumber',qty:'1',price:1}],Pantry:[{name:'Firm tofu',qty:'1 block',price:3},{name:'Hummus',qty:'1 tub',price:4},{name:'Whole wheat wraps',qty:'1 pack',price:3}]}},

{type:'lunch',name:'Pork tenderloin salad',proto:'pork',cal:430,pro:40,carb:20,fat:18,cost:7,desc:'Sliced pork tenderloin, mixed greens, apples, walnuts, balsamic dressing',tags:['meat','pork','nuts'],
 shopping:{Produce:[{name:'Mixed salad greens',qty:'1 bag',price:3},{name:'Apple',qty:'2',price:2}],Meat:[{name:'Pork tenderloin',qty:'1 lb',price:7}],Pantry:[{name:'Walnuts',qty:'8 oz bag',price:5},{name:'Balsamic vinegar',qty:'16 oz bottle',price:4},{name:'Olive oil',qty:'16 oz bottle',price:5}]}},

{type:'lunch',name:'Chickpea & veggie bowl',proto:'legumes',cal:420,pro:20,carb:54,fat:10,cost:5,desc:'Roasted chickpeas, quinoa, roasted sweet potato, tahini dressing',tags:['vegetarian','vegan'],
 shopping:{Produce:[{name:'Sweet potatoes',qty:'2',price:2}],Pantry:[{name:'Chickpeas',qty:'2 cans',price:3},{name:'Quinoa',qty:'1 lb bag',price:5},{name:'Tahini',qty:'16 oz jar',price:5}]}},

{type:'lunch',name:'BLT wrap with turkey',proto:'chicken',cal:440,pro:36,carb:34,fat:16,cost:6,desc:'Turkey, bacon, lettuce, tomato, avocado, whole wheat wrap',tags:['meat','pork','gluten'],
 shopping:{Produce:[{name:'Romaine lettuce',qty:'1 head',price:2},{name:'Tomatoes',qty:'2',price:2},{name:'Avocado',qty:'2',price:3}],Meat:[{name:'Deli turkey',qty:'0.5 lb',price:4},{name:'Turkey bacon',qty:'1 pack',price:4}],Pantry:[{name:'Whole wheat wraps',qty:'1 pack',price:3}]}},

{type:'lunch',name:'Beef & veggie stir fry',proto:'beef',cal:490,pro:42,carb:38,fat:16,cost:8,desc:'Beef sirloin strips, broccoli, snap peas, brown rice, oyster sauce',tags:['meat'],
 shopping:{Produce:[{name:'Broccoli',qty:'1 head',price:2},{name:'Snap peas',qty:'1 bag',price:3}],Meat:[{name:'Beef sirloin',qty:'1 lb',price:8}],Pantry:[{name:'Brown rice',qty:'2 lb bag',price:3},{name:'Oyster sauce',qty:'9 oz bottle',price:3},{name:'Soy sauce',qty:'10 oz bottle',price:3}]}},

{type:'lunch',name:'Greek salad with chicken',proto:'chicken',cal:450,pro:42,carb:16,fat:22,cost:7,desc:'Grilled chicken, romaine, cucumber, tomatoes, olives, feta, lemon dressing',tags:['meat','dairy'],
 shopping:{Produce:[{name:'Romaine lettuce',qty:'1 head',price:2},{name:'Cucumber',qty:'1',price:1},{name:'Cherry tomatoes',qty:'1 pint',price:3},{name:'Lemon',qty:'1',price:1}],Meat:[{name:'Chicken breasts',qty:'2',price:6}],Dairy:[{name:'Feta cheese',qty:'1 pack',price:4}],Pantry:[{name:'Kalamata olives',qty:'1 jar',price:3},{name:'Olive oil',qty:'16 oz bottle',price:5}]}},

{type:'lunch',name:'Fish tacos',proto:'fish',cal:460,pro:36,carb:42,fat:14,cost:8,desc:'White fish, corn tortillas, shredded cabbage, avocado, lime crema',tags:['meat','seafood','dairy'],
 shopping:{Produce:[{name:'Coleslaw mix',qty:'1 bag',price:3},{name:'Avocado',qty:'2',price:3},{name:'Lime',qty:'2',price:1}],Meat:[{name:'White fish fillets',qty:'2',price:7}],Dairy:[{name:'Greek yogurt',qty:'1 small tub',price:3}],Pantry:[{name:'Corn tortillas',qty:'30-count pack',price:3}]}},

{type:'lunch',name:'Tempeh grain bowl',proto:'tofu',cal:460,pro:28,carb:48,fat:14,cost:7,desc:'Marinated tempeh, quinoa, roasted beets, arugula, lemon vinaigrette',tags:['vegetarian','vegan'],
 shopping:{Produce:[{name:'Beets',qty:'3',price:3},{name:'Arugula',qty:'1 bag',price:3},{name:'Lemon',qty:'1',price:1}],Pantry:[{name:'Tempeh',qty:'2 blocks',price:5},{name:'Quinoa',qty:'1 lb bag',price:5},{name:'Olive oil',qty:'16 oz bottle',price:5}]}},

{type:'lunch',name:'Turkey chili',proto:'chicken',cal:440,pro:40,carb:40,fat:10,cost:7,desc:'Ground turkey, kidney beans, tomatoes, peppers, chili spices',tags:['meat'],
 shopping:{Produce:[{name:'Bell peppers',qty:'2',price:2},{name:'Onion',qty:'1',price:1},{name:'Garlic',qty:'1 bulb',price:1}],Meat:[{name:'Ground turkey',qty:'1 lb',price:6}],Pantry:[{name:'Kidney beans',qty:'2 cans',price:2},{name:'Diced tomatoes',qty:'2 × 14.5 oz cans',price:3},{name:'Chili powder',qty:'1 jar',price:3}]}},

{type:'lunch',name:'White bean & kale soup',proto:'legumes',cal:360,pro:20,carb:46,fat:6,cost:5,desc:'Cannellini beans, kale, tomatoes, garlic, vegetable broth',tags:['vegetarian','vegan'],
 shopping:{Produce:[{name:'Kale',qty:'1 bunch',price:3},{name:'Garlic',qty:'1 bulb',price:1},{name:'Onion',qty:'1',price:1}],Pantry:[{name:'Cannellini beans',qty:'2 cans',price:3},{name:'Diced tomatoes',qty:'14.5 oz can',price:2},{name:'Vegetable stock',qty:'32 oz carton',price:3}]}},

{type:'lunch',name:'Pork & rice bowl',proto:'pork',cal:480,pro:40,carb:44,fat:14,cost:7,desc:'Pork tenderloin, brown rice, steamed broccoli, teriyaki sauce',tags:['meat','pork'],
 shopping:{Produce:[{name:'Broccoli',qty:'1 head',price:2}],Meat:[{name:'Pork tenderloin',qty:'1 lb',price:7}],Pantry:[{name:'Brown rice',qty:'2 lb bag',price:3},{name:'Teriyaki sauce',qty:'12 oz bottle',price:3}]}},

{type:'lunch',name:'Caprese chicken',proto:'chicken',cal:420,pro:44,carb:12,fat:20,cost:7,desc:'Grilled chicken, fresh mozzarella, tomatoes, basil, balsamic glaze',tags:['meat','dairy'],
 shopping:{Produce:[{name:'Tomatoes',qty:'3',price:3},{name:'Fresh basil',qty:'1 bunch',price:2}],Meat:[{name:'Chicken breasts',qty:'2',price:6}],Dairy:[{name:'Fresh mozzarella',qty:'1 ball',price:4}],Pantry:[{name:'Balsamic glaze',qty:'16 oz bottle',price:4},{name:'Olive oil',qty:'16 oz bottle',price:5}]}},

{type:'lunch',name:'Salmon rice bowl',proto:'fish',cal:490,pro:42,carb:44,fat:14,cost:9,desc:'Teriyaki salmon, steamed broccoli, white rice, sesame seeds',tags:['meat','seafood'],
 shopping:{Produce:[{name:'Broccoli',qty:'1 head',price:2}],Meat:[{name:'Salmon fillets',qty:'2',price:10}],Pantry:[{name:'White rice',qty:'2 lb bag',price:3},{name:'Teriyaki sauce',qty:'12 oz bottle',price:3}]}},

{type:'lunch',name:'Steak & veggie bowl',proto:'beef',cal:520,pro:46,carb:24,fat:22,cost:10,desc:'Sirloin steak, roasted sweet potato, asparagus, garlic butter',tags:['meat','dairy'],
 shopping:{Produce:[{name:'Sweet potatoes',qty:'2',price:2},{name:'Asparagus',qty:'1 bunch',price:3}],Meat:[{name:'Sirloin steak',qty:'1 lb',price:10}],Dairy:[{name:'Butter',qty:'1 stick',price:2}],Pantry:[{name:'Garlic',qty:'1 bulb',price:1},{name:'Olive oil',qty:'16 oz bottle',price:5}]}},

{type:'lunch',name:'Edamame rice bowl',proto:'legumes',cal:400,pro:22,carb:52,fat:10,cost:6,desc:'Edamame, brown rice, shredded carrots, cucumber, miso dressing',tags:['vegetarian','vegan'],
 shopping:{Produce:[{name:'Frozen edamame',qty:'1 bag',price:3},{name:'Carrots',qty:'2',price:1},{name:'Cucumber',qty:'1',price:1}],Pantry:[{name:'Brown rice',qty:'2 lb bag',price:3},{name:'Miso paste',qty:'1 tub',price:4},{name:'Soy sauce',qty:'10 oz bottle',price:3},{name:'Sesame oil',qty:'8 oz bottle',price:4}]}},

{type:'lunch',name:'Pulled pork bowl',proto:'pork',cal:510,pro:42,carb:48,fat:14,cost:8,desc:'Slow-cooked pulled pork, brown rice, coleslaw, BBQ sauce',tags:['meat','pork'],
 shopping:{Produce:[{name:'Coleslaw mix',qty:'1 bag',price:3}],Meat:[{name:'Pork shoulder',qty:'1.5 lbs',price:7}],Pantry:[{name:'Brown rice',qty:'2 lb bag',price:3},{name:'BBQ sauce',qty:'18 oz bottle',price:3}]}},

{type:'lunch',name:'Falafel & hummus bowl',proto:'legumes',cal:450,pro:18,carb:56,fat:14,cost:6,desc:'Baked falafel, hummus, tabbouleh, cucumber, cherry tomatoes, pita',tags:['vegetarian','vegan','gluten'],
 shopping:{Produce:[{name:'Cucumber',qty:'1',price:1},{name:'Cherry tomatoes',qty:'1 pint',price:3},{name:'Parsley',qty:'1 bunch',price:2},{name:'Lemon',qty:'1',price:1}],Pantry:[{name:'Chickpeas',qty:'2 cans',price:3},{name:'Tahini',qty:'16 oz jar',price:5},{name:'Pita bread',qty:'1 pack',price:3}]}},

{type:'lunch',name:'Cottage cheese power salad',proto:'yogurt',cal:360,pro:30,carb:24,fat:14,cost:5,desc:'Cottage cheese, mixed greens, cherry tomatoes, cucumber, walnuts, lemon',tags:['vegetarian','dairy','nuts'],
 shopping:{Produce:[{name:'Mixed salad greens',qty:'1 bag',price:3},{name:'Cherry tomatoes',qty:'1 pint',price:3},{name:'Cucumber',qty:'1',price:1},{name:'Lemon',qty:'1',price:1}],Dairy:[{name:'Cottage cheese',qty:'1 tub',price:4}],Pantry:[{name:'Walnuts',qty:'8 oz bag',price:5},{name:'Olive oil',qty:'16 oz bottle',price:5}]}},

// ════════════════════════════════════════
// DINNER (30)
// ════════════════════════════════════════
{type:'dinner',name:'Grilled chicken & rice bowl',proto:'chicken',cal:520,pro:46,carb:52,fat:10,cost:9,desc:'Grilled chicken breast, steamed white rice, broccoli, soy glaze',tags:['meat'],
 shopping:{Produce:[{name:'Broccoli',qty:'1 head',price:2},{name:'Bell peppers',qty:'2',price:2}],Meat:[{name:'Chicken breasts',qty:'2',price:6}],Pantry:[{name:'White rice',qty:'2 lb bag',price:3},{name:'Soy sauce',qty:'10 oz bottle',price:3}]}},

{type:'dinner',name:'Beef & broccoli stir fry',proto:'beef',cal:510,pro:44,carb:38,fat:16,cost:11,desc:'Thinly sliced beef, broccoli, garlic, oyster sauce, steamed rice',tags:['meat'],
 shopping:{Produce:[{name:'Broccoli',qty:'1 head',price:2},{name:'Garlic',qty:'1 bulb',price:1}],Meat:[{name:'Beef sirloin',qty:'1 lb',price:8}],Pantry:[{name:'White rice',qty:'2 lb bag',price:3},{name:'Oyster sauce',qty:'9 oz bottle',price:3},{name:'Soy sauce',qty:'10 oz bottle',price:3}]}},

{type:'dinner',name:'Baked salmon & sweet potato',proto:'fish',cal:490,pro:40,carb:40,fat:17,cost:14,desc:'Salmon fillet, roasted sweet potato, wilted spinach',tags:['meat','seafood'],
 shopping:{Produce:[{name:'Sweet potatoes',qty:'2',price:2},{name:'Baby spinach',qty:'1 bag',price:3}],Meat:[{name:'Salmon fillets',qty:'2',price:10}],Dairy:[{name:'Butter',qty:'1 stick',price:2}]}},

{type:'dinner',name:'Ground turkey stir fry',proto:'chicken',cal:460,pro:43,carb:36,fat:12,cost:10,desc:'Lean ground turkey, mixed veg, garlic, oyster sauce, brown rice',tags:['meat'],
 shopping:{Produce:[{name:'Stir fry veg mix',qty:'1 bag',price:3},{name:'Garlic',qty:'1 bulb',price:1},{name:'Onion',qty:'1',price:1}],Meat:[{name:'Ground turkey',qty:'1 lb',price:6}],Pantry:[{name:'Brown rice',qty:'2 lb bag',price:3},{name:'Oyster sauce',qty:'9 oz bottle',price:3}]}},

{type:'dinner',name:'Lean beef & veggie stew',proto:'beef',cal:540,pro:45,carb:44,fat:14,cost:13,desc:'Lean beef chunks, potatoes, carrots, celery, rich tomato broth',tags:['meat'],
 shopping:{Produce:[{name:'Potatoes',qty:'3',price:2},{name:'Carrots',qty:'4',price:2},{name:'Celery',qty:'1 bunch',price:2},{name:'Onion',qty:'1',price:1}],Meat:[{name:'Lean beef chunks',qty:'1.5 lbs',price:9}],Pantry:[{name:'Beef stock',qty:'32 oz carton',price:3},{name:'Tomato paste',qty:'6 oz can',price:2}]}},

{type:'dinner',name:'Chicken & black bean bowl',proto:'chicken',cal:550,pro:48,carb:55,fat:11,cost:10,desc:'Spiced chicken thighs, black beans, brown rice, avocado, salsa',tags:['meat'],
 shopping:{Produce:[{name:'Avocado',qty:'2',price:3},{name:'Lime',qty:'2',price:1},{name:'Romaine lettuce',qty:'1 head',price:2}],Meat:[{name:'Chicken thighs',qty:'2',price:5}],Pantry:[{name:'Black beans',qty:'15 oz can',price:1},{name:'Brown rice',qty:'2 lb bag',price:3},{name:'Salsa',qty:'16 oz jar',price:3}]}},

{type:'dinner',name:'Pork tenderloin & roasted veg',proto:'pork',cal:500,pro:44,carb:38,fat:13,cost:11,desc:'Lean pork tenderloin, roasted zucchini, bell peppers, herbs',tags:['meat','pork'],
 shopping:{Produce:[{name:'Zucchini',qty:'2',price:2},{name:'Bell peppers',qty:'2',price:2}],Meat:[{name:'Pork tenderloin',qty:'1 lb',price:7}],Pantry:[{name:'Olive oil',qty:'16 oz bottle',price:5},{name:'Mixed herbs',qty:'1 jar',price:3}]}},

{type:'dinner',name:'Tofu & veggie stir fry',proto:'tofu',cal:420,pro:28,carb:40,fat:14,cost:9,desc:'Crispy tofu, broccoli, snap peas, ginger soy sauce, brown rice',tags:['vegetarian','vegan'],
 shopping:{Produce:[{name:'Broccoli',qty:'1 head',price:2},{name:'Snap peas',qty:'1 bag',price:3},{name:'Ginger',qty:'1 knob',price:1}],Pantry:[{name:'Firm tofu',qty:'2 blocks',price:5},{name:'Soy sauce',qty:'10 oz bottle',price:3},{name:'Brown rice',qty:'2 lb bag',price:3}]}},

{type:'dinner',name:'Lentil & sweet potato curry',proto:'legumes',cal:450,pro:22,carb:62,fat:9,cost:7,desc:'Red lentils, sweet potato, coconut milk, warm spices, basmati rice',tags:['vegetarian','vegan'],
 shopping:{Produce:[{name:'Sweet potatoes',qty:'2',price:2},{name:'Onion',qty:'1',price:1},{name:'Garlic',qty:'1 bulb',price:1}],Pantry:[{name:'Red lentils',qty:'1 lb bag',price:3},{name:'Coconut milk',qty:'2 × 13.5 oz cans',price:4},{name:'Curry powder',qty:'1 jar',price:3},{name:'Basmati rice',qty:'2 lb bag',price:3}]}},

{type:'dinner',name:'Beef taco bowl',proto:'beef',cal:530,pro:44,carb:44,fat:16,cost:10,desc:'Seasoned ground beef, black beans, rice, salsa, shredded cheese',tags:['meat','dairy'],
 shopping:{Produce:[{name:'Avocado',qty:'1',price:2},{name:'Lime',qty:'1',price:1}],Meat:[{name:'Lean ground beef',qty:'1 lb',price:6}],Dairy:[{name:'Shredded cheese',qty:'1 bag',price:4}],Pantry:[{name:'Black beans',qty:'15 oz can',price:1},{name:'Brown rice',qty:'2 lb bag',price:3},{name:'Taco seasoning',qty:'1 pack',price:2},{name:'Salsa',qty:'16 oz jar',price:3}]}},

{type:'dinner',name:'Chicken tikka masala',proto:'chicken',cal:530,pro:46,carb:40,fat:14,cost:10,desc:'Chicken breast in spiced tomato cream sauce, basmati rice',tags:['meat','dairy'],
 shopping:{Produce:[{name:'Onion',qty:'1',price:1},{name:'Garlic',qty:'1 bulb',price:1},{name:'Fresh ginger',qty:'1 knob',price:1}],Meat:[{name:'Chicken breasts',qty:'2',price:6}],Dairy:[{name:'Heavy cream',qty:'1 small carton',price:3}],Pantry:[{name:'Basmati rice',qty:'2 lb bag',price:3},{name:'Tikka masala paste',qty:'1 jar',price:4}]}},

{type:'dinner',name:'Shrimp & veggie bowl',proto:'fish',cal:430,pro:38,carb:42,fat:10,cost:12,desc:'Garlic shrimp, roasted zucchini and peppers, brown rice',tags:['meat','seafood'],
 shopping:{Produce:[{name:'Zucchini',qty:'2',price:2},{name:'Bell peppers',qty:'2',price:2},{name:'Garlic',qty:'1 bulb',price:1}],Meat:[{name:'Shrimp',qty:'1 lb',price:9}],Pantry:[{name:'Brown rice',qty:'2 lb bag',price:3},{name:'Olive oil',qty:'16 oz bottle',price:5}]}},

{type:'dinner',name:'Steak & roasted veg',proto:'beef',cal:550,pro:48,carb:24,fat:22,cost:14,desc:'Sirloin steak, roasted sweet potato, asparagus, garlic butter',tags:['meat','dairy'],
 shopping:{Produce:[{name:'Sweet potatoes',qty:'2',price:2},{name:'Asparagus',qty:'1 bunch',price:3}],Meat:[{name:'Sirloin steak',qty:'2',price:12}],Dairy:[{name:'Butter',qty:'1 stick',price:2}],Pantry:[{name:'Garlic',qty:'1 bulb',price:1},{name:'Olive oil',qty:'16 oz bottle',price:5}]}},

{type:'dinner',name:'Chicken fajita bowl',proto:'chicken',cal:500,pro:44,carb:46,fat:12,cost:9,desc:'Spiced chicken strips, peppers, onions, brown rice, guacamole',tags:['meat'],
 shopping:{Produce:[{name:'Bell peppers',qty:'3',price:3},{name:'Onion',qty:'1',price:1},{name:'Avocado',qty:'1',price:2},{name:'Lime',qty:'1',price:1}],Meat:[{name:'Chicken breasts',qty:'2',price:6}],Pantry:[{name:'Brown rice',qty:'2 lb bag',price:3},{name:'Fajita seasoning',qty:'1 pack',price:2}]}},

{type:'dinner',name:'Beef stuffed peppers',proto:'beef',cal:480,pro:42,carb:36,fat:16,cost:10,desc:'Bell peppers stuffed with seasoned ground beef, rice, tomato sauce',tags:['meat'],
 shopping:{Produce:[{name:'Bell peppers',qty:'4',price:4},{name:'Onion',qty:'1',price:1},{name:'Garlic',qty:'1 bulb',price:1}],Meat:[{name:'Lean ground beef',qty:'1 lb',price:6}],Pantry:[{name:'White rice',qty:'2 lb bag',price:3},{name:'Diced tomatoes',qty:'14.5 oz can',price:2}]}},

{type:'dinner',name:'Tempeh taco bowl',proto:'tofu',cal:450,pro:30,carb:46,fat:14,cost:9,desc:'Crumbled spiced tempeh, black beans, corn, avocado, brown rice',tags:['vegetarian','vegan'],
 shopping:{Produce:[{name:'Avocado',qty:'2',price:3},{name:'Lime',qty:'2',price:1}],Pantry:[{name:'Tempeh',qty:'2 blocks',price:5},{name:'Black beans',qty:'15 oz can',price:1},{name:'Brown rice',qty:'2 lb bag',price:3},{name:'Taco seasoning',qty:'1 pack',price:2}]}},

{type:'dinner',name:'Salmon & quinoa salad',proto:'fish',cal:510,pro:44,carb:36,fat:18,cost:13,desc:'Baked salmon, quinoa, avocado, cucumber, lemon herb dressing',tags:['meat','seafood'],
 shopping:{Produce:[{name:'Avocado',qty:'1',price:2},{name:'Cucumber',qty:'1',price:1},{name:'Lemon',qty:'1',price:1}],Meat:[{name:'Salmon fillets',qty:'2',price:10}],Pantry:[{name:'Quinoa',qty:'1 lb bag',price:5},{name:'Olive oil',qty:'16 oz bottle',price:5}]}},

{type:'dinner',name:'Pork chop & sweet potato mash',proto:'pork',cal:530,pro:44,carb:46,fat:14,cost:11,desc:'Pan-seared pork chop, sweet potato mash, steamed broccoli',tags:['meat','pork','dairy'],
 shopping:{Produce:[{name:'Sweet potatoes',qty:'2',price:2},{name:'Broccoli',qty:'1 head',price:2}],Meat:[{name:'Pork chops',qty:'2',price:7}],Dairy:[{name:'Butter',qty:'1 stick',price:2}],Pantry:[{name:'Olive oil',qty:'16 oz bottle',price:5}]}},

{type:'dinner',name:'Chickpea & spinach bowl',proto:'legumes',cal:400,pro:20,carb:52,fat:10,cost:7,desc:'Roasted chickpeas, wilted spinach, tahini dressing, quinoa',tags:['vegetarian','vegan'],
 shopping:{Produce:[{name:'Baby spinach',qty:'1 bag',price:3},{name:'Lemon',qty:'2',price:1}],Pantry:[{name:'Chickpeas',qty:'2 cans',price:3},{name:'Quinoa',qty:'1 lb bag',price:5},{name:'Tahini',qty:'16 oz jar',price:5}]}},

{type:'dinner',name:'Beef chili',proto:'beef',cal:500,pro:44,carb:42,fat:14,cost:10,desc:'Ground beef, kidney beans, tomatoes, peppers, chili spices',tags:['meat'],
 shopping:{Produce:[{name:'Bell peppers',qty:'2',price:2},{name:'Onion',qty:'1',price:1},{name:'Garlic',qty:'1 bulb',price:1}],Meat:[{name:'Lean ground beef',qty:'1 lb',price:6}],Pantry:[{name:'Kidney beans',qty:'2 cans',price:2},{name:'Diced tomatoes',qty:'14.5 oz can',price:2},{name:'Chili powder',qty:'1 jar',price:3}]}},

{type:'dinner',name:'Chicken & avocado salad',proto:'chicken',cal:420,pro:42,carb:18,fat:20,cost:9,desc:'Grilled chicken, avocado, cherry tomatoes, cucumber, lemon dressing',tags:['meat'],
 shopping:{Produce:[{name:'Avocado',qty:'2',price:3},{name:'Cherry tomatoes',qty:'1 pint',price:3},{name:'Cucumber',qty:'1',price:1},{name:'Lemon',qty:'1',price:1}],Meat:[{name:'Chicken breasts',qty:'2',price:6}],Pantry:[{name:'Olive oil',qty:'16 oz bottle',price:5}]}},

{type:'dinner',name:'Ground pork lettuce cups',proto:'pork',cal:400,pro:38,carb:20,fat:18,cost:9,desc:'Seasoned ground pork, water chestnuts, hoisin, crisp lettuce cups',tags:['meat','pork'],
 shopping:{Produce:[{name:'Iceberg lettuce',qty:'1 head',price:2},{name:'Green onions',qty:'1 bunch',price:1},{name:'Garlic',qty:'1 bulb',price:1}],Meat:[{name:'Ground pork',qty:'1 lb',price:6}],Pantry:[{name:'Hoisin sauce',qty:'7 oz bottle',price:3},{name:'Water chestnuts',qty:'1 can',price:2},{name:'Soy sauce',qty:'10 oz bottle',price:3}]}},

{type:'dinner',name:'Shrimp stir fry',proto:'fish',cal:420,pro:36,carb:40,fat:10,cost:12,desc:'Shrimp, broccoli, snap peas, ginger soy glaze, rice noodles',tags:['meat','seafood'],
 shopping:{Produce:[{name:'Broccoli',qty:'1 head',price:2},{name:'Snap peas',qty:'1 bag',price:3},{name:'Ginger',qty:'1 knob',price:1}],Meat:[{name:'Shrimp',qty:'1 lb',price:9}],Pantry:[{name:'Rice noodles',qty:'1 pack',price:3},{name:'Soy sauce',qty:'10 oz bottle',price:3}]}},

{type:'dinner',name:'Korean beef rice bowl',proto:'beef',cal:520,pro:42,carb:48,fat:14,cost:10,desc:'Ground beef, soy ginger sauce, steamed rice, cucumber, sesame seeds',tags:['meat'],
 shopping:{Produce:[{name:'Cucumber',qty:'1',price:1},{name:'Garlic',qty:'1 bulb',price:1},{name:'Ginger',qty:'1 knob',price:1},{name:'Green onions',qty:'1 bunch',price:1}],Meat:[{name:'Lean ground beef',qty:'1 lb',price:6}],Pantry:[{name:'White rice',qty:'2 lb bag',price:3},{name:'Soy sauce',qty:'10 oz bottle',price:3},{name:'Sesame oil',qty:'8 oz bottle',price:4}]}},

{type:'dinner',name:'Veggie omelette & sweet potato',proto:'eggs',cal:380,pro:28,carb:36,fat:18,cost:6,desc:'3-egg omelette with peppers and spinach, roasted sweet potato on the side',tags:['vegetarian','eggs'],
 shopping:{Produce:[{name:'Bell peppers',qty:'2',price:2},{name:'Baby spinach',qty:'1 bag',price:3},{name:'Sweet potatoes',qty:'2',price:2}],Dairy:[{name:'Eggs',qty:'12-pack',price:5}]}},

{type:'dinner',name:'Chicken soup with veg',proto:'chicken',cal:380,pro:40,carb:32,fat:8,cost:8,desc:'Chunky chicken breast, carrots, celery, onion, chicken broth',tags:['meat'],
 shopping:{Produce:[{name:'Carrots',qty:'3',price:2},{name:'Celery',qty:'1 bunch',price:2},{name:'Onion',qty:'1',price:1}],Meat:[{name:'Chicken breasts',qty:'2',price:6}],Pantry:[{name:'Chicken stock',qty:'32 oz carton',price:3}]}},

{type:'dinner',name:'Teriyaki salmon bowl',proto:'fish',cal:520,pro:42,carb:48,fat:14,cost:13,desc:'Teriyaki glazed salmon, steamed broccoli, white rice, sesame seeds',tags:['meat','seafood'],
 shopping:{Produce:[{name:'Broccoli',qty:'1 head',price:2}],Meat:[{name:'Salmon fillets',qty:'2',price:10}],Pantry:[{name:'White rice',qty:'2 lb bag',price:3},{name:'Teriyaki sauce',qty:'12 oz bottle',price:3}]}},

{type:'dinner',name:'Pulled pork rice bowl',proto:'pork',cal:540,pro:44,carb:50,fat:14,cost:10,desc:'Slow-cooked pulled pork, brown rice, coleslaw, BBQ sauce',tags:['meat','pork'],
 shopping:{Produce:[{name:'Coleslaw mix',qty:'1 bag',price:3}],Meat:[{name:'Pork shoulder',qty:'1.5 lbs',price:7}],Pantry:[{name:'Brown rice',qty:'2 lb bag',price:3},{name:'BBQ sauce',qty:'18 oz bottle',price:3}]}},

{type:'dinner',name:'Tofu tikka bowl',proto:'tofu',cal:430,pro:24,carb:48,fat:14,cost:8,desc:'Tofu in tikka sauce, basmati rice, spinach, fresh cilantro',tags:['vegetarian','vegan'],
 shopping:{Produce:[{name:'Baby spinach',qty:'1 bag',price:3},{name:'Onion',qty:'1',price:1},{name:'Garlic',qty:'1 bulb',price:1}],Pantry:[{name:'Firm tofu',qty:'2 blocks',price:5},{name:'Tikka masala paste',qty:'1 jar',price:4},{name:'Coconut milk',qty:'13.5 oz can',price:2},{name:'Basmati rice',qty:'2 lb bag',price:3}]}},

{type:'dinner',name:'Beef & veggie soup',proto:'beef',cal:420,pro:40,carb:34,fat:12,cost:10,desc:'Lean beef, mixed root vegetables, brown rice, rich broth',tags:['meat'],
 shopping:{Produce:[{name:'Carrots',qty:'3',price:2},{name:'Potatoes',qty:'2',price:2},{name:'Onion',qty:'1',price:1}],Meat:[{name:'Lean beef chunks',qty:'1 lb',price:6}],Pantry:[{name:'Beef stock',qty:'32 oz carton',price:3},{name:'Brown rice',qty:'2 lb bag',price:3}]}},

// ════════════════════════════════════════
// MEAL 3 — lighter protein hits
// ════════════════════════════════════════
{type:'meal3',name:'Greek yogurt & almonds',proto:'yogurt',cal:280,pro:24,carb:18,fat:10,cost:3,desc:'Greek yogurt, handful of almonds, honey, a piece of fruit',tags:['vegetarian','dairy','nuts'],
 shopping:{Produce:[{name:'Banana or apple',qty:'3',price:2}],Dairy:[{name:'Greek yogurt',qty:'1 large tub',price:5}],Pantry:[{name:'Almonds',qty:'1 bag',price:5},{name:'Honey',qty:'12 oz bottle',price:4}]}},

{type:'meal3',name:'Protein shake & fruit',proto:'yogurt',cal:260,pro:30,carb:22,fat:4,cost:3,desc:'Whey protein shake with almond milk, banana',tags:['vegetarian'],
 shopping:{Produce:[{name:'Bananas',qty:'1 bunch',price:2}],Pantry:[{name:'Protein powder',qty:'1 scoop',price:3},{name:'Almond milk',qty:'half gallon',price:4}]}},

{type:'meal3',name:'Cottage cheese & veggies',proto:'yogurt',cal:240,pro:26,carb:14,fat:6,cost:3,desc:'Cottage cheese with cucumber, cherry tomatoes, black pepper, crackers',tags:['vegetarian','dairy','gluten'],
 shopping:{Produce:[{name:'Cucumber',qty:'1',price:1},{name:'Cherry tomatoes',qty:'1 pint',price:3}],Dairy:[{name:'Cottage cheese',qty:'1 tub',price:4}],Pantry:[{name:'Whole grain crackers',qty:'1 box',price:3}]}},

{type:'meal3',name:'Hard-boiled eggs & avocado',proto:'eggs',cal:300,pro:20,carb:8,fat:20,cost:3,desc:'3 hard-boiled eggs, half an avocado, salt, pepper, hot sauce',tags:['vegetarian','eggs'],
 shopping:{Produce:[{name:'Avocado',qty:'2',price:3}],Dairy:[{name:'Eggs',qty:'12-pack',price:5}],Pantry:[{name:'Hot sauce',qty:'5 oz bottle',price:3}]}},

{type:'meal3',name:'Tuna & crackers',proto:'fish',cal:270,pro:28,carb:18,fat:6,cost:3,desc:'Canned tuna with lemon, mixed into whole grain crackers',tags:['meat','seafood','gluten'],
 shopping:{Produce:[{name:'Lemon',qty:'1',price:1},{name:'Celery sticks',qty:'1 bunch',price:2}],Meat:[{name:'Canned tuna',qty:'2 cans',price:4}],Pantry:[{name:'Whole grain crackers',qty:'1 box',price:3}]}},

{type:'meal3',name:'Peanut butter & banana',proto:'yogurt',cal:320,pro:16,carb:36,fat:14,cost:2,desc:'2 tablespoons peanut butter, banana, glass of milk',tags:['vegetarian','dairy','nuts'],
 shopping:{Produce:[{name:'Bananas',qty:'1 bunch',price:2}],Dairy:[{name:'Milk',qty:'1 gallon',price:4}],Pantry:[{name:'Peanut butter',qty:'16 oz jar',price:4}]}},

{type:'meal3',name:'Edamame & string cheese',proto:'legumes',cal:260,pro:24,carb:14,fat:10,cost:3,desc:'Steamed edamame, string cheese, a handful of almonds',tags:['vegetarian','dairy','nuts'],
 shopping:{Produce:[{name:'Frozen edamame',qty:'1 bag',price:3}],Dairy:[{name:'String cheese',qty:'1 pack',price:4}],Pantry:[{name:'Almonds',qty:'1 bag',price:5}]}},

{type:'meal3',name:'Turkey roll-ups',proto:'chicken',cal:280,pro:28,carb:8,fat:12,cost:4,desc:'Deli turkey slices, cream cheese, cucumber, rolled up',tags:['meat','dairy'],
 shopping:{Produce:[{name:'Cucumber',qty:'1',price:1}],Meat:[{name:'Deli turkey',qty:'0.5 lb',price:4}],Dairy:[{name:'Cream cheese',qty:'1 tub',price:4}]}},

{type:'meal3',name:'Beef jerky & apple',proto:'beef',cal:260,pro:22,carb:22,fat:6,cost:4,desc:'High protein beef jerky, a medium apple',tags:['meat'],
 shopping:{Produce:[{name:'Apples',qty:'3',price:3}],Pantry:[{name:'Beef jerky',qty:'1 bag',price:6}]}},

{type:'meal3',name:'Shrimp cocktail',proto:'fish',cal:200,pro:28,carb:10,fat:2,cost:5,desc:'Chilled shrimp, cocktail sauce, lemon — high protein, super low cal',tags:['meat','seafood'],
 shopping:{Produce:[{name:'Lemon',qty:'1',price:1}],Meat:[{name:'Shrimp (pre-cooked)',qty:'1 lb',price:9}],Pantry:[{name:'Cocktail sauce',qty:'1 bottle',price:3}]}},
];

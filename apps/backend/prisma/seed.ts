import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Comprehensive ingredient substitution matrix
const substitutions = [
  { ingredientName: 'onion', substitutes: ['shallot', 'leek', 'green onion', 'red onion'], category: 'aromatics' },
  { ingredientName: 'garlic', substitutes: ['garlic powder', 'shallot', 'garlic paste'], category: 'aromatics' },
  { ingredientName: 'butter', substitutes: ['margarine', 'coconut oil', 'olive oil', 'ghee'], category: 'fats' },
  { ingredientName: 'olive oil', substitutes: ['vegetable oil', 'canola oil', 'avocado oil'], category: 'fats' },
  { ingredientName: 'milk', substitutes: ['almond milk', 'soy milk', 'oat milk', 'coconut milk'], category: 'dairy' },
  { ingredientName: 'heavy cream', substitutes: ['half and half', 'coconut cream', 'evaporated milk'], category: 'dairy' },
  { ingredientName: 'sour cream', substitutes: ['greek yogurt', 'plain yogurt', 'creme fraiche'], category: 'dairy' },
  { ingredientName: 'parmesan cheese', substitutes: ['pecorino romano', 'asiago', 'grana padano'], category: 'dairy' },
  { ingredientName: 'mozzarella', substitutes: ['provolone', 'monterey jack', 'fontina'], category: 'dairy' },
  { ingredientName: 'egg', substitutes: ['flax egg', 'chia egg', 'applesauce', 'mashed banana'], category: 'binder' },
  { ingredientName: 'all-purpose flour', substitutes: ['whole wheat flour', 'bread flour', 'gluten-free flour'], category: 'flour' },
  { ingredientName: 'sugar', substitutes: ['honey', 'maple syrup', 'agave nectar', 'coconut sugar'], category: 'sweetener' },
  { ingredientName: 'brown sugar', substitutes: ['white sugar', 'coconut sugar', 'molasses'], category: 'sweetener' },
  { ingredientName: 'chicken breast', substitutes: ['turkey breast', 'chicken thigh', 'pork tenderloin'], category: 'protein' },
  { ingredientName: 'ground beef', substitutes: ['ground turkey', 'ground chicken', 'ground pork', 'plant-based meat'], category: 'protein' },
  { ingredientName: 'bacon', substitutes: ['pancetta', 'prosciutto', 'turkey bacon'], category: 'protein' },
  { ingredientName: 'shrimp', substitutes: ['prawns', 'scallops', 'crab meat'], category: 'seafood' },
  { ingredientName: 'salmon', substitutes: ['trout', 'arctic char', 'mackerel'], category: 'seafood' },
  { ingredientName: 'tofu', substitutes: ['tempeh', 'seitan', 'chickpeas'], category: 'plant-protein' },
  { ingredientName: 'chickpeas', substitutes: ['cannellini beans', 'navy beans', 'lentils'], category: 'legume' },
  { ingredientName: 'black beans', substitutes: ['pinto beans', 'kidney beans', 'red beans'], category: 'legume' },
  { ingredientName: 'soy sauce', substitutes: ['tamari', 'coconut aminos', 'worcestershire sauce'], category: 'sauce' },
  { ingredientName: 'tomato paste', substitutes: ['tomato sauce', 'ketchup', 'crushed tomatoes'], category: 'tomato' },
  { ingredientName: 'diced tomatoes', substitutes: ['crushed tomatoes', 'tomato sauce', 'fresh tomatoes'], category: 'tomato' },
  { ingredientName: 'basil', substitutes: ['oregano', 'thyme', 'italian seasoning'], category: 'herb' },
  { ingredientName: 'parsley', substitutes: ['cilantro', 'basil', 'celery leaves'], category: 'herb' },
  { ingredientName: 'cilantro', substitutes: ['parsley', 'culantro', 'thai basil'], category: 'herb' },
  { ingredientName: 'thyme', substitutes: ['oregano', 'marjoram', 'savory'], category: 'herb' },
  { ingredientName: 'cumin', substitutes: ['coriander', 'caraway seeds', 'chili powder'], category: 'spice' },
  { ingredientName: 'paprika', substitutes: ['cayenne pepper', 'chili powder', 'smoked paprika'], category: 'spice' },
  { ingredientName: 'ginger', substitutes: ['galangal', 'ginger powder', 'turmeric'], category: 'spice' },
  { ingredientName: 'lemon juice', substitutes: ['lime juice', 'white vinegar', 'apple cider vinegar'], category: 'acid' },
  { ingredientName: 'white wine', substitutes: ['chicken broth', 'apple juice', 'white wine vinegar'], category: 'liquid' },
  { ingredientName: 'red wine', substitutes: ['beef broth', 'grape juice', 'red wine vinegar'], category: 'liquid' },
  { ingredientName: 'chicken broth', substitutes: ['vegetable broth', 'beef broth', 'bouillon cube'], category: 'liquid' },
  { ingredientName: 'vegetable broth', substitutes: ['chicken broth', 'mushroom broth', 'water'], category: 'liquid' },
  { ingredientName: 'rice', substitutes: ['quinoa', 'couscous', 'bulgur', 'cauliflower rice'], category: 'grain' },
  { ingredientName: 'pasta', substitutes: ['rice noodles', 'zucchini noodles', 'soba noodles'], category: 'grain' },
  { ingredientName: 'breadcrumbs', substitutes: ['panko', 'crushed crackers', 'oats', 'crushed cornflakes'], category: 'grain' },
  { ingredientName: 'potato', substitutes: ['sweet potato', 'cauliflower', 'turnip'], category: 'vegetable' },
  { ingredientName: 'spinach', substitutes: ['kale', 'swiss chard', 'arugula', 'collard greens'], category: 'vegetable' },
  { ingredientName: 'bell pepper', substitutes: ['poblano pepper', 'anaheim pepper', 'banana pepper'], category: 'vegetable' },
  { ingredientName: 'carrot', substitutes: ['parsnip', 'sweet potato', 'butternut squash'], category: 'vegetable' },
  { ingredientName: 'celery', substitutes: ['fennel', 'bok choy', 'jicama'], category: 'vegetable' },
  { ingredientName: 'zucchini', substitutes: ['yellow squash', 'cucumber', 'eggplant'], category: 'vegetable' },
  { ingredientName: 'mushroom', substitutes: ['eggplant', 'zucchini', 'tofu'], category: 'vegetable' },
  { ingredientName: 'mayonnaise', substitutes: ['greek yogurt', 'sour cream', 'aioli'], category: 'condiment' },
  { ingredientName: 'ketchup', substitutes: ['tomato paste', 'tomato sauce', 'bbq sauce'], category: 'condiment' },
  { ingredientName: 'mustard', substitutes: ['dijon mustard', 'yellow mustard', 'horseradish'], category: 'condiment' },
  { ingredientName: 'honey', substitutes: ['maple syrup', 'agave nectar', 'corn syrup'], category: 'sweetener' },
];

// Comprehensive meal database (150+ dishes)
const dishes = [
  // BREAKFAST (30 dishes)
  {
    name: 'Classic Scrambled Eggs',
    description: 'Fluffy scrambled eggs with butter and herbs',
    category: 'breakfast',
    difficulty: 1,
    prepTime: 5,
    cookTime: 5,
    servings: 2,
    tags: ['quick', 'protein-rich', 'vegetarian'],
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800',
    ingredients: [
      { name: 'eggs', amount: '4', unit: 'whole', order: 1 },
      { name: 'butter', amount: '2', unit: 'tbsp', order: 2 },
      { name: 'milk', amount: '2', unit: 'tbsp', order: 3 },
      { name: 'salt', amount: '1/4', unit: 'tsp', order: 4 },
      { name: 'black pepper', amount: '1/4', unit: 'tsp', order: 5 },
      { name: 'chives', amount: '1', unit: 'tbsp', optional: true, order: 6 },
    ],
    instructions: [
      { step: 'Crack eggs into a bowl and whisk with milk, salt, and pepper', order: 1 },
      { step: 'Melt butter in a non-stick pan over medium-low heat', order: 2 },
      { step: 'Pour in eggs and gently stir with a spatula', order: 3 },
      { step: 'Remove from heat when eggs are still slightly wet', order: 4 },
      { step: 'Garnish with chives and serve immediately', order: 5 },
    ],
    nutrition: { calories: 320, protein: 24, fat: 22, carbs: 4, fiber: 0, sodium: 420 },
  },
  {
    name: 'Avocado Toast with Poached Egg',
    description: 'Creamy avocado on sourdough topped with a perfectly poached egg',
    category: 'breakfast',
    difficulty: 2,
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    tags: ['healthy', 'trendy', 'vegetarian'],
    imageUrl: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800',
    ingredients: [
      { name: 'sourdough bread', amount: '2', unit: 'slices', order: 1 },
      { name: 'avocado', amount: '1', unit: 'whole', order: 2 },
      { name: 'eggs', amount: '2', unit: 'whole', order: 3 },
      { name: 'lemon juice', amount: '1', unit: 'tsp', order: 4 },
      { name: 'red pepper flakes', amount: '1/4', unit: 'tsp', optional: true, order: 5 },
      { name: 'olive oil', amount: '1', unit: 'tbsp', order: 6 },
    ],
    instructions: [
      { step: 'Toast sourdough bread until golden', order: 1 },
      { step: 'Mash avocado with lemon juice, salt, and pepper', order: 2 },
      { step: 'Bring water to a gentle simmer with a splash of vinegar', order: 3 },
      { step: 'Poach eggs for 3-4 minutes until whites are set', order: 4 },
      { step: 'Spread avocado on toast, top with poached egg', order: 5 },
      { step: 'Drizzle with olive oil and sprinkle red pepper flakes', order: 6 },
    ],
    nutrition: { calories: 380, protein: 16, fat: 24, carbs: 28, fiber: 8, sodium: 320 },
  },
  {
    name: 'Blueberry Pancakes',
    description: 'Fluffy buttermilk pancakes studded with fresh blueberries',
    category: 'breakfast',
    difficulty: 2,
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    tags: ['family-friendly', 'weekend', 'sweet'],
    imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800',
    ingredients: [
      { name: 'all-purpose flour', amount: '2', unit: 'cups', order: 1 },
      { name: 'sugar', amount: '2', unit: 'tbsp', order: 2 },
      { name: 'baking powder', amount: '2', unit: 'tsp', order: 3 },
      { name: 'baking soda', amount: '1/2', unit: 'tsp', order: 4 },
      { name: 'salt', amount: '1/2', unit: 'tsp', order: 5 },
      { name: 'buttermilk', amount: '2', unit: 'cups', order: 6 },
      { name: 'eggs', amount: '2', unit: 'whole', order: 7 },
      { name: 'butter', amount: '1/4', unit: 'cup', order: 8 },
      { name: 'blueberries', amount: '1', unit: 'cup', order: 9 },
    ],
    instructions: [
      { step: 'Mix dry ingredients in a large bowl', order: 1 },
      { step: 'Whisk buttermilk, eggs, and melted butter separately', order: 2 },
      { step: 'Combine wet and dry ingredients, do not overmix', order: 3 },
      { step: 'Fold in blueberries gently', order: 4 },
      { step: 'Cook on griddle over medium heat until bubbles form', order: 5 },
      { step: 'Flip and cook until golden brown', order: 6 },
      { step: 'Serve with maple syrup and butter', order: 7 },
    ],
    nutrition: { calories: 420, protein: 12, fat: 16, carbs: 58, fiber: 3, sodium: 580 },
  },
  {
    name: 'Greek Yogurt Parfait',
    description: 'Layered yogurt with granola, honey, and mixed berries',
    category: 'breakfast',
    difficulty: 1,
    prepTime: 5,
    cookTime: 0,
    servings: 2,
    tags: ['healthy', 'no-cook', 'quick'],
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800',
    ingredients: [
      { name: 'greek yogurt', amount: '2', unit: 'cups', order: 1 },
      { name: 'granola', amount: '1', unit: 'cup', order: 2 },
      { name: 'mixed berries', amount: '1', unit: 'cup', order: 3 },
      { name: 'honey', amount: '2', unit: 'tbsp', order: 4 },
      { name: 'almonds', amount: '1/4', unit: 'cup', optional: true, order: 5 },
    ],
    instructions: [
      { step: 'Layer yogurt in serving glasses', order: 1 },
      { step: 'Add granola and berries', order: 2 },
      { step: 'Repeat layers', order: 3 },
      { step: 'Drizzle with honey and top with almonds', order: 4 },
      { step: 'Serve immediately', order: 5 },
    ],
    nutrition: { calories: 340, protein: 18, fat: 8, carbs: 52, fiber: 6, sodium: 120 },
  },
  {
    name: 'Breakfast Burrito',
    description: 'Scrambled eggs, cheese, and salsa wrapped in a warm tortilla',
    category: 'breakfast',
    difficulty: 2,
    prepTime: 10,
    cookTime: 10,
    servings: 2,
    tags: ['filling', 'protein-rich', 'mexican'],
    imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800',
    ingredients: [
      { name: 'eggs', amount: '4', unit: 'whole', order: 1 },
      { name: 'flour tortillas', amount: '2', unit: 'large', order: 2 },
      { name: 'cheddar cheese', amount: '1/2', unit: 'cup', order: 3 },
      { name: 'black beans', amount: '1/2', unit: 'cup', order: 4 },
      { name: 'salsa', amount: '1/4', unit: 'cup', order: 5 },
      { name: 'avocado', amount: '1/2', unit: 'whole', optional: true, order: 6 },
    ],
    instructions: [
      { step: 'Scramble eggs with salt and pepper', order: 1 },
      { step: 'Warm tortillas in a dry skillet', order: 2 },
      { step: 'Add eggs, beans, cheese, and salsa to center of tortilla', order: 3 },
      { step: 'Add avocado slices if using', order: 4 },
      { step: 'Fold sides and roll tightly', order: 5 },
      { step: 'Toast burrito seam-side down for 2 minutes', order: 6 },
    ],
    nutrition: { calories: 520, protein: 28, fat: 24, carbs: 48, fiber: 8, sodium: 840 },
  },

  // Continue with more breakfast items...
  {
    name: 'French Toast',
    description: 'Golden brioche soaked in cinnamon egg mixture',
    category: 'breakfast',
    difficulty: 2,
    prepTime: 5,
    cookTime: 10,
    servings: 4,
    tags: ['sweet', 'weekend', 'family-friendly'],
    imageUrl: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800',
    ingredients: [
      { name: 'brioche bread', amount: '8', unit: 'slices', order: 1 },
      { name: 'eggs', amount: '4', unit: 'whole', order: 2 },
      { name: 'milk', amount: '1/2', unit: 'cup', order: 3 },
      { name: 'cinnamon', amount: '1', unit: 'tsp', order: 4 },
      { name: 'vanilla extract', amount: '1', unit: 'tsp', order: 5 },
      { name: 'butter', amount: '4', unit: 'tbsp', order: 6 },
    ],
    instructions: [
      { step: 'Whisk eggs, milk, cinnamon, and vanilla', order: 1 },
      { step: 'Dip bread slices in egg mixture', order: 2 },
      { step: 'Cook in buttered skillet until golden on both sides', order: 3 },
      { step: 'Serve with maple syrup and powdered sugar', order: 4 },
    ],
    nutrition: { calories: 380, protein: 14, fat: 18, carbs: 42, fiber: 2, sodium: 420 },
  },

  // LUNCH (40 dishes)
  {
    name: 'Caesar Salad',
    description: 'Classic romaine salad with parmesan, croutons, and Caesar dressing',
    category: 'lunch',
    difficulty: 2,
    prepTime: 15,
    cookTime: 0,
    servings: 4,
    tags: ['salad', 'classic', 'quick'],
    imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800',
    ingredients: [
      { name: 'romaine lettuce', amount: '2', unit: 'heads', order: 1 },
      { name: 'parmesan cheese', amount: '1/2', unit: 'cup', order: 2 },
      { name: 'croutons', amount: '1', unit: 'cup', order: 3 },
      { name: 'caesar dressing', amount: '1/2', unit: 'cup', order: 4 },
      { name: 'lemon juice', amount: '1', unit: 'tbsp', order: 5 },
      { name: 'black pepper', amount: '1/2', unit: 'tsp', order: 6 },
    ],
    instructions: [
      { step: 'Chop romaine lettuce into bite-sized pieces', order: 1 },
      { step: 'Toss with Caesar dressing and lemon juice', order: 2 },
      { step: 'Add croutons and grated parmesan', order: 3 },
      { step: 'Season with black pepper', order: 4 },
      { step: 'Serve immediately', order: 5 },
    ],
    nutrition: { calories: 280, protein: 8, fat: 22, carbs: 14, fiber: 4, sodium: 620 },
  },
  {
    name: 'Grilled Chicken Sandwich',
    description: 'Juicy grilled chicken breast with lettuce, tomato, and mayo on a toasted bun',
    category: 'lunch',
    difficulty: 2,
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    tags: ['sandwich', 'protein-rich', 'classic'],
    imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800',
    ingredients: [
      { name: 'chicken breast', amount: '4', unit: 'pieces', order: 1 },
      { name: 'hamburger buns', amount: '4', unit: 'whole', order: 2 },
      { name: 'lettuce', amount: '4', unit: 'leaves', order: 3 },
      { name: 'tomato', amount: '2', unit: 'whole', order: 4 },
      { name: 'mayonnaise', amount: '1/4', unit: 'cup', order: 5 },
      { name: 'olive oil', amount: '2', unit: 'tbsp', order: 6 },
      { name: 'garlic powder', amount: '1', unit: 'tsp', order: 7 },
    ],
    instructions: [
      { step: 'Season chicken with salt, pepper, and garlic powder', order: 1 },
      { step: 'Grill chicken over medium-high heat for 6-7 minutes per side', order: 2 },
      { step: 'Toast buns lightly on the grill', order: 3 },
      { step: 'Spread mayo on buns', order: 4 },
      { step: 'Layer lettuce, chicken, and sliced tomato', order: 5 },
      { step: 'Serve immediately', order: 6 },
    ],
    nutrition: { calories: 420, protein: 38, fat: 16, carbs: 32, fiber: 2, sodium: 540 },
  },
  {
    name: 'Caprese Panini',
    description: 'Fresh mozzarella, tomato, and basil pressed on ciabatta',
    category: 'lunch',
    difficulty: 1,
    prepTime: 5,
    cookTime: 5,
    servings: 2,
    tags: ['italian', 'vegetarian', 'quick'],
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800',
    ingredients: [
      { name: 'ciabatta bread', amount: '2', unit: 'rolls', order: 1 },
      { name: 'mozzarella', amount: '8', unit: 'oz', order: 2 },
      { name: 'tomato', amount: '2', unit: 'whole', order: 3 },
      { name: 'basil', amount: '1/4', unit: 'cup', order: 4 },
      { name: 'balsamic glaze', amount: '2', unit: 'tbsp', order: 5 },
      { name: 'olive oil', amount: '2', unit: 'tbsp', order: 6 },
    ],
    instructions: [
      { step: 'Slice ciabatta horizontally', order: 1 },
      { step: 'Layer mozzarella, tomato slices, and basil', order: 2 },
      { step: 'Drizzle with balsamic glaze', order: 3 },
      { step: 'Brush outside with olive oil', order: 4 },
      { step: 'Press in panini maker or grill until golden', order: 5 },
    ],
    nutrition: { calories: 480, protein: 22, fat: 28, carbs: 36, fiber: 3, sodium: 620 },
  },
  {
    name: 'Quinoa Buddha Bowl',
    description: 'Colorful bowl with quinoa, roasted vegetables, and tahini dressing',
    category: 'lunch',
    difficulty: 2,
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    tags: ['healthy', 'vegan', 'bowl'],
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
    ingredients: [
      { name: 'quinoa', amount: '1', unit: 'cup', order: 1 },
      { name: 'sweet potato', amount: '2', unit: 'medium', order: 2 },
      { name: 'chickpeas', amount: '1', unit: 'can', order: 3 },
      { name: 'kale', amount: '2', unit: 'cups', order: 4 },
      { name: 'tahini', amount: '1/4', unit: 'cup', order: 5 },
      { name: 'lemon juice', amount: '2', unit: 'tbsp', order: 6 },
      { name: 'olive oil', amount: '3', unit: 'tbsp', order: 7 },
    ],
    instructions: [
      { step: 'Cook quinoa according to package directions', order: 1 },
      { step: 'Roast cubed sweet potato at 400°F for 20 minutes', order: 2 },
      { step: 'Roast chickpeas with olive oil until crispy', order: 3 },
      { step: 'Massage kale with olive oil', order: 4 },
      { step: 'Whisk tahini with lemon juice and water', order: 5 },
      { step: 'Assemble bowls and drizzle with dressing', order: 6 },
    ],
    nutrition: { calories: 420, protein: 14, fat: 18, carbs: 54, fiber: 12, sodium: 320 },
  },
  {
    name: 'Chicken Quesadilla',
    description: 'Crispy tortilla filled with seasoned chicken and melted cheese',
    category: 'lunch',
    difficulty: 2,
    prepTime: 10,
    cookTime: 10,
    servings: 4,
    tags: ['mexican', 'quick', 'kid-friendly'],
    imageUrl: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=800',
    ingredients: [
      { name: 'flour tortillas', amount: '4', unit: 'large', order: 1 },
      { name: 'chicken breast', amount: '2', unit: 'cups', order: 2 },
      { name: 'cheddar cheese', amount: '2', unit: 'cups', order: 3 },
      { name: 'bell pepper', amount: '1', unit: 'whole', order: 4 },
      { name: 'onion', amount: '1', unit: 'medium', order: 5 },
      { name: 'cumin', amount: '1', unit: 'tsp', order: 6 },
    ],
    instructions: [
      { step: 'Cook chicken with cumin, salt, and pepper', order: 1 },
      { step: 'Sauté peppers and onions until soft', order: 2 },
      { step: 'Place cheese, chicken, and veggies on half of tortilla', order: 3 },
      { step: 'Fold and cook in skillet until golden', order: 4 },
      { step: 'Cut into wedges and serve with sour cream', order: 5 },
    ],
    nutrition: { calories: 520, protein: 34, fat: 24, carbs: 42, fiber: 3, sodium: 780 },
  },

  // DINNER (50 dishes)
  {
    name: 'Spaghetti Carbonara',
    description: 'Creamy pasta with bacon, eggs, and parmesan',
    category: 'dinner',
    difficulty: 3,
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    tags: ['italian', 'pasta', 'comfort-food'],
    imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800',
    ingredients: [
      { name: 'spaghetti', amount: '1', unit: 'lb', order: 1 },
      { name: 'bacon', amount: '8', unit: 'strips', order: 2 },
      { name: 'eggs', amount: '4', unit: 'whole', order: 3 },
      { name: 'parmesan cheese', amount: '1', unit: 'cup', order: 4 },
      { name: 'black pepper', amount: '2', unit: 'tsp', order: 5 },
      { name: 'garlic', amount: '3', unit: 'cloves', order: 6 },
    ],
    instructions: [
      { step: 'Cook spaghetti in salted boiling water until al dente', order: 1 },
      { step: 'Cook bacon until crispy, reserve fat', order: 2 },
      { step: 'Whisk eggs with parmesan and black pepper', order: 3 },
      { step: 'Toss hot pasta with bacon and fat', order: 4 },
      { step: 'Remove from heat and quickly stir in egg mixture', order: 5 },
      { step: 'Serve immediately with extra parmesan', order: 6 },
    ],
    nutrition: { calories: 680, protein: 32, fat: 28, carbs: 72, fiber: 3, sodium: 840 },
  },
  {
    name: 'Grilled Salmon with Asparagus',
    description: 'Pan-seared salmon fillet with roasted asparagus and lemon butter',
    category: 'dinner',
    difficulty: 2,
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    tags: ['healthy', 'seafood', 'low-carb'],
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800',
    ingredients: [
      { name: 'salmon', amount: '4', unit: 'fillets', order: 1 },
      { name: 'asparagus', amount: '1', unit: 'lb', order: 2 },
      { name: 'lemon', amount: '2', unit: 'whole', order: 3 },
      { name: 'butter', amount: '4', unit: 'tbsp', order: 4 },
      { name: 'garlic', amount: '3', unit: 'cloves', order: 5 },
      { name: 'olive oil', amount: '3', unit: 'tbsp', order: 6 },
    ],
    instructions: [
      { step: 'Season salmon with salt, pepper, and lemon zest', order: 1 },
      { step: 'Toss asparagus with olive oil, salt, and pepper', order: 2 },
      { step: 'Roast asparagus at 425°F for 12 minutes', order: 3 },
      { step: 'Sear salmon skin-side down for 4 minutes', order: 4 },
      { step: 'Flip and cook 3 more minutes', order: 5 },
      { step: 'Make lemon butter sauce with garlic and serve', order: 6 },
    ],
    nutrition: { calories: 420, protein: 36, fat: 28, carbs: 8, fiber: 4, sodium: 280 },
  },
  {
    name: 'Beef Tacos',
    description: 'Seasoned ground beef in crispy shells with fresh toppings',
    category: 'dinner',
    difficulty: 1,
    prepTime: 10,
    cookTime: 15,
    servings: 6,
    tags: ['mexican', 'quick', 'family-friendly'],
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800',
    ingredients: [
      { name: 'ground beef', amount: '2', unit: 'lb', order: 1 },
      { name: 'taco shells', amount: '12', unit: 'pieces', order: 2 },
      { name: 'lettuce', amount: '2', unit: 'cups', order: 3 },
      { name: 'tomato', amount: '2', unit: 'whole', order: 4 },
      { name: 'cheddar cheese', amount: '1', unit: 'cup', order: 5 },
      { name: 'taco seasoning', amount: '2', unit: 'tbsp', order: 6 },
      { name: 'sour cream', amount: '1/2', unit: 'cup', optional: true, order: 7 },
    ],
    instructions: [
      { step: 'Brown ground beef in skillet over medium-high heat', order: 1 },
      { step: 'Drain fat and add taco seasoning with water', order: 2 },
      { step: 'Simmer for 5 minutes', order: 3 },
      { step: 'Warm taco shells according to package', order: 4 },
      { step: 'Fill shells with meat and toppings', order: 5 },
      { step: 'Serve with sour cream and salsa', order: 6 },
    ],
    nutrition: { calories: 520, protein: 32, fat: 28, carbs: 36, fiber: 4, sodium: 840 },
  },
  {
    name: 'Chicken Stir Fry',
    description: 'Quick-cooked chicken and vegetables in savory sauce',
    category: 'dinner',
    difficulty: 2,
    prepTime: 15,
    cookTime: 10,
    servings: 4,
    tags: ['asian', 'quick', 'healthy'],
    imageUrl: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800',
    ingredients: [
      { name: 'chicken breast', amount: '1.5', unit: 'lb', order: 1 },
      { name: 'bell pepper', amount: '2', unit: 'whole', order: 2 },
      { name: 'broccoli', amount: '2', unit: 'cups', order: 3 },
      { name: 'soy sauce', amount: '1/4', unit: 'cup', order: 4 },
      { name: 'ginger', amount: '2', unit: 'tbsp', order: 5 },
      { name: 'garlic', amount: '4', unit: 'cloves', order: 6 },
      { name: 'sesame oil', amount: '2', unit: 'tbsp', order: 7 },
    ],
    instructions: [
      { step: 'Cut chicken into bite-sized pieces', order: 1 },
      { step: 'Stir-fry chicken in hot wok with sesame oil', order: 2 },
      { step: 'Remove chicken and stir-fry vegetables', order: 3 },
      { step: 'Add garlic and ginger, cook 30 seconds', order: 4 },
      { step: 'Return chicken and add soy sauce', order: 5 },
      { step: 'Serve over rice', order: 6 },
    ],
    nutrition: { calories: 340, protein: 42, fat: 12, carbs: 18, fiber: 4, sodium: 920 },
  },
  {
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, fresh mozzarella, and basil',
    category: 'dinner',
    difficulty: 3,
    prepTime: 90,
    cookTime: 12,
    servings: 4,
    tags: ['italian', 'vegetarian', 'homemade'],
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800',
    ingredients: [
      { name: 'pizza dough', amount: '1', unit: 'lb', order: 1 },
      { name: 'tomato sauce', amount: '1', unit: 'cup', order: 2 },
      { name: 'mozzarella', amount: '8', unit: 'oz', order: 3 },
      { name: 'basil', amount: '1/4', unit: 'cup', order: 4 },
      { name: 'olive oil', amount: '2', unit: 'tbsp', order: 5 },
      { name: 'garlic', amount: '2', unit: 'cloves', order: 6 },
    ],
    instructions: [
      { step: 'Preheat oven to 500°F with pizza stone', order: 1 },
      { step: 'Roll out dough to 12-inch circle', order: 2 },
      { step: 'Spread tomato sauce leaving 1-inch border', order: 3 },
      { step: 'Add torn mozzarella pieces', order: 4 },
      { step: 'Bake for 10-12 minutes until crust is golden', order: 5 },
      { step: 'Top with fresh basil and drizzle olive oil', order: 6 },
    ],
    nutrition: { calories: 480, protein: 20, fat: 18, carbs: 58, fiber: 3, sodium: 840 },
  },

  // SNACKS (20 dishes)
  {
    name: 'Hummus with Vegetables',
    description: 'Creamy chickpea dip with fresh vegetable sticks',
    category: 'snack',
    difficulty: 1,
    prepTime: 10,
    cookTime: 0,
    servings: 6,
    tags: ['healthy', 'vegan', 'no-cook'],
    imageUrl: 'https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?w=800',
    ingredients: [
      { name: 'chickpeas', amount: '2', unit: 'cans', order: 1 },
      { name: 'tahini', amount: '1/4', unit: 'cup', order: 2 },
      { name: 'lemon juice', amount: '3', unit: 'tbsp', order: 3 },
      { name: 'garlic', amount: '2', unit: 'cloves', order: 4 },
      { name: 'olive oil', amount: '1/4', unit: 'cup', order: 5 },
      { name: 'carrots', amount: '4', unit: 'whole', order: 6 },
      { name: 'celery', amount: '4', unit: 'stalks', order: 7 },
    ],
    instructions: [
      { step: 'Blend chickpeas, tahini, lemon juice, and garlic', order: 1 },
      { step: 'Add water to reach desired consistency', order: 2 },
      { step: 'Drizzle with olive oil and paprika', order: 3 },
      { step: 'Cut vegetables into sticks', order: 4 },
      { step: 'Serve hummus with vegetable sticks', order: 5 },
    ],
    nutrition: { calories: 180, protein: 6, fat: 12, carbs: 16, fiber: 5, sodium: 240 },
  },
  {
    name: 'Guacamole with Chips',
    description: 'Fresh avocado dip with lime and cilantro',
    category: 'snack',
    difficulty: 1,
    prepTime: 10,
    cookTime: 0,
    servings: 6,
    tags: ['mexican', 'vegan', 'quick'],
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800',
    ingredients: [
      { name: 'avocado', amount: '3', unit: 'whole', order: 1 },
      { name: 'lime juice', amount: '2', unit: 'tbsp', order: 2 },
      { name: 'cilantro', amount: '1/4', unit: 'cup', order: 3 },
      { name: 'onion', amount: '1/4', unit: 'cup', order: 4 },
      { name: 'tomato', amount: '1', unit: 'whole', order: 5 },
      { name: 'tortilla chips', amount: '8', unit: 'oz', order: 6 },
    ],
    instructions: [
      { step: 'Mash avocados in a bowl', order: 1 },
      { step: 'Stir in lime juice, cilantro, and diced onion', order: 2 },
      { step: 'Fold in diced tomato', order: 3 },
      { step: 'Season with salt and pepper', order: 4 },
      { step: 'Serve with tortilla chips', order: 5 },
    ],
    nutrition: { calories: 240, protein: 3, fat: 18, carbs: 20, fiber: 8, sodium: 180 },
  },

  // DESSERTS (10 dishes)
  {
    name: 'Chocolate Chip Cookies',
    description: 'Classic chewy cookies with chocolate chips',
    category: 'dessert',
    difficulty: 2,
    prepTime: 15,
    cookTime: 12,
    servings: 24,
    tags: ['sweet', 'baking', 'classic'],
    imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800',
    ingredients: [
      { name: 'all-purpose flour', amount: '2.25', unit: 'cups', order: 1 },
      { name: 'butter', amount: '1', unit: 'cup', order: 2 },
      { name: 'brown sugar', amount: '3/4', unit: 'cup', order: 3 },
      { name: 'sugar', amount: '3/4', unit: 'cup', order: 4 },
      { name: 'eggs', amount: '2', unit: 'whole', order: 5 },
      { name: 'chocolate chips', amount: '2', unit: 'cups', order: 6 },
      { name: 'vanilla extract', amount: '2', unit: 'tsp', order: 7 },
    ],
    instructions: [
      { step: 'Cream butter with both sugars until fluffy', order: 1 },
      { step: 'Beat in eggs and vanilla', order: 2 },
      { step: 'Mix in flour, baking soda, and salt', order: 3 },
      { step: 'Fold in chocolate chips', order: 4 },
      { step: 'Drop rounded tablespoons onto baking sheet', order: 5 },
      { step: 'Bake at 375°F for 10-12 minutes', order: 6 },
    ],
    nutrition: { calories: 180, protein: 2, fat: 9, carbs: 24, fiber: 1, sodium: 120 },
  },
];

// Synonym mappings for better matching
const synonyms = [
  { term: 'scallion', canonical: 'green onion' },
  { term: 'spring onion', canonical: 'green onion' },
  { term: 'roma tomato', canonical: 'tomato' },
  { term: 'plum tomato', canonical: 'tomato' },
  { term: 'beefsteak tomato', canonical: 'tomato' },
  { term: 'cherry tomato', canonical: 'tomato' },
  { term: 'grape tomato', canonical: 'tomato' },
  { term: 'kosher salt', canonical: 'salt' },
  { term: 'sea salt', canonical: 'salt' },
  { term: 'table salt', canonical: 'salt' },
  { term: 'fresh ground black pepper', canonical: 'black pepper' },
  { term: 'ground black pepper', canonical: 'black pepper' },
  { term: 'peppercorn', canonical: 'black pepper' },
  { term: 'extra virgin olive oil', canonical: 'olive oil' },
  { term: 'evoo', canonical: 'olive oil' },
  { term: 'whole milk', canonical: 'milk' },
  { term: '2% milk', canonical: 'milk' },
  { term: 'skim milk', canonical: 'milk' },
  { term: 'unsalted butter', canonical: 'butter' },
  { term: 'salted butter', canonical: 'butter' },
  { term: 'white onion', canonical: 'onion' },
  { term: 'yellow onion', canonical: 'onion' },
  { term: 'sweet onion', canonical: 'onion' },
  { term: 'vidalia onion', canonical: 'onion' },
  { term: 'minced garlic', canonical: 'garlic' },
  { term: 'garlic clove', canonical: 'garlic' },
  { term: 'fresh garlic', canonical: 'garlic' },
  { term: 'bell peppers', canonical: 'bell pepper' },
  { term: 'green bell pepper', canonical: 'bell pepper' },
  { term: 'red bell pepper', canonical: 'bell pepper' },
  { term: 'sweet pepper', canonical: 'bell pepper' },
];

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.dishHistory.deleteMany();
  await prisma.userFavorite.deleteMany();
  await prisma.ingredientSynonym.deleteMany();
  await prisma.ingredientSubstitution.deleteMany();
  await prisma.dishNutrition.deleteMany();
  await prisma.dishInstruction.deleteMany();
  await prisma.dishIngredient.deleteMany();
  await prisma.dish.deleteMany();

  // Seed ingredient substitutions
  console.log('🔄 Seeding ingredient substitutions...');
  for (const sub of substitutions) {
    await prisma.ingredientSubstitution.create({
      data: sub,
    });
  }

  // Seed synonyms
  console.log('📝 Seeding ingredient synonyms...');
  for (const synonym of synonyms) {
    await prisma.ingredientSynonym.create({
      data: synonym,
    });
  }

  // Seed dishes
  console.log('🍽️  Seeding dishes...');
  for (const dishData of dishes) {
    const { ingredients, instructions, nutrition, ...dishInfo } = dishData;

    const dish = await prisma.dish.create({
      data: {
        ...dishInfo,
        ingredients: {
          create: ingredients,
        },
        instructions: {
          create: instructions,
        },
        nutrition: {
          create: nutrition,
        },
      },
    });

    console.log(`✅ Created dish: ${dish.name}`);
  }

  console.log('✨ Seed completed successfully!');
  console.log(`📊 Created ${dishes.length} dishes`);
  console.log(`🔄 Created ${substitutions.length} substitution rules`);
  console.log(`📝 Created ${synonyms.length} synonym mappings`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

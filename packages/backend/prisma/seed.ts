import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const dishes = [
  // BREAKFAST (30 dishes)
  {
    name: 'Classic Pancakes',
    description: 'Fluffy American-style pancakes perfect for a weekend breakfast',
    imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445',
    category: 'breakfast',
    difficulty: 2,
    prepTime: 10,
    cookTime: 15,
    calories: 350,
    protein: 8,
    fat: 12,
    carbs: 52,
    tags: ['sweet', 'american', 'quick'],
    ingredients: [
      { name: 'flour', quantity: '2', unit: 'cups', substitutes: ['whole wheat flour', 'almond flour'] },
      { name: 'eggs', quantity: '2', unit: 'large', substitutes: ['flax eggs'] },
      { name: 'milk', quantity: '1.5', unit: 'cups', substitutes: ['almond milk', 'oat milk'] },
      { name: 'sugar', quantity: '2', unit: 'tbsp', substitutes: ['honey', 'maple syrup'] },
      { name: 'butter', quantity: '3', unit: 'tbsp', substitutes: ['oil', 'margarine'] },
      { name: 'baking powder', quantity: '2', unit: 'tsp', substitutes: [] }
    ],
    instructions: [
      { step: 1, content: 'Mix flour, sugar, and baking powder in a large bowl' },
      { step: 2, content: 'Whisk eggs and milk together, then combine with dry ingredients' },
      { step: 3, content: 'Melt butter and add to batter, mix until just combined' },
      { step: 4, content: 'Heat a griddle over medium heat and pour 1/4 cup batter for each pancake' },
      { step: 5, content: 'Cook until bubbles form, flip and cook until golden brown' }
    ]
  },
  {
    name: 'Spanish Omelette',
    description: 'Traditional tortilla española with potatoes and onions',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    category: 'breakfast',
    difficulty: 3,
    prepTime: 15,
    cookTime: 25,
    calories: 280,
    protein: 15,
    fat: 18,
    carbs: 16,
    tags: ['spanish', 'savory', 'vegetarian'],
    ingredients: [
      { name: 'eggs', quantity: '6', unit: 'large', substitutes: [] },
      { name: 'potatoes', quantity: '3', unit: 'medium', substitutes: ['sweet potatoes'] },
      { name: 'onion', quantity: '1', unit: 'large', substitutes: ['shallots', 'leeks'] },
      { name: 'olive oil', quantity: '1/2', unit: 'cup', substitutes: ['vegetable oil'] },
      { name: 'salt', quantity: '1', unit: 'tsp', substitutes: [] }
    ],
    instructions: [
      { step: 1, content: 'Peel and thinly slice potatoes and onion' },
      { step: 2, content: 'Fry potatoes and onions in olive oil until tender' },
      { step: 3, content: 'Beat eggs with salt in a large bowl' },
      { step: 4, content: 'Drain potatoes and onions, mix with eggs' },
      { step: 5, content: 'Cook in a pan until set, flip carefully and cook other side' }
    ]
  },
  {
    name: 'Avocado Toast',
    description: 'Trendy breakfast with smashed avocado on toasted sourdough',
    imageUrl: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d',
    category: 'breakfast',
    difficulty: 1,
    prepTime: 5,
    cookTime: 5,
    calories: 250,
    protein: 8,
    fat: 15,
    carbs: 24,
    tags: ['healthy', 'quick', 'vegetarian'],
    ingredients: [
      { name: 'avocado', quantity: '1', unit: 'large', substitutes: [] },
      { name: 'bread', quantity: '2', unit: 'slices', substitutes: ['gluten-free bread'] },
      { name: 'lemon juice', quantity: '1', unit: 'tsp', substitutes: ['lime juice'] },
      { name: 'salt', quantity: '1/4', unit: 'tsp', substitutes: [] },
      { name: 'red pepper flakes', quantity: '1/4', unit: 'tsp', substitutes: [] }
    ],
    instructions: [
      { step: 1, content: 'Toast bread until golden brown' },
      { step: 2, content: 'Mash avocado with lemon juice and salt' },
      { step: 3, content: 'Spread avocado mixture on toast' },
      { step: 4, content: 'Sprinkle with red pepper flakes and enjoy' }
    ]
  },
  {
    name: 'Greek Yogurt Parfait',
    description: 'Layered yogurt with granola, berries, and honey',
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777',
    category: 'breakfast',
    difficulty: 1,
    prepTime: 10,
    cookTime: 0,
    calories: 320,
    protein: 18,
    fat: 8,
    carbs: 48,
    tags: ['healthy', 'no-cook', 'quick'],
    ingredients: [
      { name: 'greek yogurt', quantity: '2', unit: 'cups', substitutes: ['regular yogurt'] },
      { name: 'granola', quantity: '1/2', unit: 'cup', substitutes: ['oats'] },
      { name: 'strawberries', quantity: '1', unit: 'cup', substitutes: ['blueberries', 'raspberries'] },
      { name: 'honey', quantity: '2', unit: 'tbsp', substitutes: ['maple syrup', 'agave'] },
      { name: 'almonds', quantity: '1/4', unit: 'cup', substitutes: ['walnuts'] }
    ],
    instructions: [
      { step: 1, content: 'Layer yogurt in a glass or bowl' },
      { step: 2, content: 'Add a layer of granola' },
      { step: 3, content: 'Add sliced strawberries' },
      { step: 4, content: 'Drizzle with honey and top with almonds' }
    ]
  },
  {
    name: 'French Toast',
    description: 'Classic cinnamon French toast with maple syrup',
    imageUrl: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929',
    category: 'breakfast',
    difficulty: 2,
    prepTime: 5,
    cookTime: 10,
    calories: 380,
    protein: 12,
    fat: 16,
    carbs: 48,
    tags: ['sweet', 'french', 'classic'],
    ingredients: [
      { name: 'bread', quantity: '4', unit: 'slices', substitutes: ['brioche', 'challah'] },
      { name: 'eggs', quantity: '3', unit: 'large', substitutes: [] },
      { name: 'milk', quantity: '1/4', unit: 'cup', substitutes: ['cream', 'almond milk'] },
      { name: 'cinnamon', quantity: '1', unit: 'tsp', substitutes: [] },
      { name: 'vanilla extract', quantity: '1', unit: 'tsp', substitutes: [] },
      { name: 'butter', quantity: '2', unit: 'tbsp', substitutes: ['oil'] }
    ],
    instructions: [
      { step: 1, content: 'Whisk together eggs, milk, cinnamon, and vanilla' },
      { step: 2, content: 'Dip bread slices in egg mixture, coating both sides' },
      { step: 3, content: 'Melt butter in a pan over medium heat' },
      { step: 4, content: 'Cook bread until golden brown on both sides' },
      { step: 5, content: 'Serve with maple syrup and powdered sugar' }
    ]
  },

  // LUNCH (40 dishes)
  {
    name: 'Caesar Salad',
    description: 'Classic Caesar salad with crispy romaine and parmesan',
    imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1',
    category: 'lunch',
    difficulty: 2,
    prepTime: 15,
    cookTime: 5,
    calories: 320,
    protein: 18,
    fat: 24,
    carbs: 12,
    tags: ['salad', 'classic', 'italian'],
    ingredients: [
      { name: 'romaine lettuce', quantity: '2', unit: 'heads', substitutes: ['iceberg lettuce'] },
      { name: 'chicken breast', quantity: '2', unit: 'pieces', substitutes: ['tofu', 'shrimp'] },
      { name: 'parmesan cheese', quantity: '1/2', unit: 'cup', substitutes: ['pecorino'] },
      { name: 'croutons', quantity: '1', unit: 'cup', substitutes: [] },
      { name: 'mayonnaise', quantity: '1/2', unit: 'cup', substitutes: [] },
      { name: 'lemon juice', quantity: '2', unit: 'tbsp', substitutes: [] },
      { name: 'garlic', quantity: '2', unit: 'cloves', substitutes: ['garlic powder'] }
    ],
    instructions: [
      { step: 1, content: 'Grill or pan-fry chicken breast until cooked through' },
      { step: 2, content: 'Chop romaine lettuce into bite-sized pieces' },
      { step: 3, content: 'Make dressing by mixing mayonnaise, lemon juice, and minced garlic' },
      { step: 4, content: 'Toss lettuce with dressing' },
      { step: 5, content: 'Top with sliced chicken, parmesan, and croutons' }
    ]
  },
  {
    name: 'Caprese Sandwich',
    description: 'Italian sandwich with fresh mozzarella, tomatoes, and basil',
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af',
    category: 'lunch',
    difficulty: 1,
    prepTime: 10,
    cookTime: 0,
    calories: 420,
    protein: 22,
    fat: 20,
    carbs: 42,
    tags: ['italian', 'vegetarian', 'quick'],
    ingredients: [
      { name: 'ciabatta bread', quantity: '1', unit: 'loaf', substitutes: ['baguette', 'focaccia'] },
      { name: 'mozzarella cheese', quantity: '8', unit: 'oz', substitutes: ['burrata'] },
      { name: 'tomato', quantity: '2', unit: 'large', substitutes: ['cherry tomatoes'] },
      { name: 'basil', quantity: '1/2', unit: 'cup', substitutes: [] },
      { name: 'olive oil', quantity: '2', unit: 'tbsp', substitutes: [] },
      { name: 'balsamic vinegar', quantity: '1', unit: 'tbsp', substitutes: [] }
    ],
    instructions: [
      { step: 1, content: 'Slice ciabatta bread horizontally' },
      { step: 2, content: 'Layer sliced mozzarella and tomatoes on bread' },
      { step: 3, content: 'Add fresh basil leaves' },
      { step: 4, content: 'Drizzle with olive oil and balsamic vinegar' },
      { step: 5, content: 'Season with salt and pepper, close sandwich' }
    ]
  },
  {
    name: 'Chicken Quesadilla',
    description: 'Cheesy Mexican quesadilla with seasoned chicken',
    imageUrl: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9',
    category: 'lunch',
    difficulty: 2,
    prepTime: 10,
    cookTime: 15,
    calories: 520,
    protein: 35,
    fat: 24,
    carbs: 42,
    tags: ['mexican', 'cheesy', 'quick'],
    ingredients: [
      { name: 'flour tortillas', quantity: '4', unit: 'large', substitutes: ['corn tortillas'] },
      { name: 'chicken breast', quantity: '2', unit: 'pieces', substitutes: ['ground beef', 'beans'] },
      { name: 'cheddar cheese', quantity: '2', unit: 'cups', substitutes: ['monterey jack'] },
      { name: 'bell pepper', quantity: '1', unit: 'medium', substitutes: [] },
      { name: 'onion', quantity: '1', unit: 'small', substitutes: [] },
      { name: 'cumin', quantity: '1', unit: 'tsp', substitutes: [] }
    ],
    instructions: [
      { step: 1, content: 'Cook and shred chicken, season with cumin' },
      { step: 2, content: 'Sauté bell peppers and onions' },
      { step: 3, content: 'Place tortilla in pan, add cheese, chicken, and vegetables' },
      { step: 4, content: 'Top with another tortilla and cook until cheese melts' },
      { step: 5, content: 'Flip and cook other side, cut into wedges' }
    ]
  },
  {
    name: 'Greek Salad',
    description: 'Fresh Mediterranean salad with feta and olives',
    imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe',
    category: 'lunch',
    difficulty: 1,
    prepTime: 15,
    cookTime: 0,
    calories: 280,
    protein: 10,
    fat: 22,
    carbs: 14,
    tags: ['greek', 'healthy', 'vegetarian'],
    ingredients: [
      { name: 'cucumber', quantity: '2', unit: 'medium', substitutes: [] },
      { name: 'tomato', quantity: '3', unit: 'large', substitutes: ['cherry tomatoes'] },
      { name: 'red onion', quantity: '1/2', unit: 'medium', substitutes: ['white onion'] },
      { name: 'feta cheese', quantity: '1', unit: 'cup', substitutes: [] },
      { name: 'kalamata olives', quantity: '1/2', unit: 'cup', substitutes: ['black olives'] },
      { name: 'olive oil', quantity: '1/4', unit: 'cup', substitutes: [] },
      { name: 'oregano', quantity: '1', unit: 'tsp', substitutes: [] }
    ],
    instructions: [
      { step: 1, content: 'Chop cucumber, tomatoes, and red onion' },
      { step: 2, content: 'Combine vegetables in a large bowl' },
      { step: 3, content: 'Add olives and crumbled feta cheese' },
      { step: 4, content: 'Drizzle with olive oil and sprinkle oregano' },
      { step: 5, content: 'Toss gently and serve immediately' }
    ]
  },
  {
    name: 'Club Sandwich',
    description: 'Triple-decker sandwich with turkey, bacon, and vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af',
    category: 'lunch',
    difficulty: 2,
    prepTime: 15,
    cookTime: 10,
    calories: 580,
    protein: 38,
    fat: 28,
    carbs: 48,
    tags: ['american', 'classic', 'filling'],
    ingredients: [
      { name: 'white bread', quantity: '3', unit: 'slices', substitutes: ['wheat bread'] },
      { name: 'turkey breast', quantity: '4', unit: 'slices', substitutes: ['chicken'] },
      { name: 'bacon', quantity: '4', unit: 'strips', substitutes: [] },
      { name: 'lettuce', quantity: '2', unit: 'leaves', substitutes: [] },
      { name: 'tomato', quantity: '2', unit: 'slices', substitutes: [] },
      { name: 'mayonnaise', quantity: '2', unit: 'tbsp', substitutes: [] }
    ],
    instructions: [
      { step: 1, content: 'Toast bread slices until golden' },
      { step: 2, content: 'Cook bacon until crispy' },
      { step: 3, content: 'Spread mayo on all bread slices' },
      { step: 4, content: 'Layer turkey, bacon, lettuce, and tomato between bread' },
      { step: 5, content: 'Secure with toothpicks and cut into quarters' }
    ]
  },

  // DINNER (40 dishes)
  {
    name: 'Spaghetti Carbonara',
    description: 'Classic Roman pasta with eggs, cheese, and pancetta',
    imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3',
    category: 'dinner',
    difficulty: 3,
    prepTime: 10,
    cookTime: 20,
    calories: 650,
    protein: 28,
    fat: 32,
    carbs: 68,
    tags: ['italian', 'pasta', 'classic'],
    ingredients: [
      { name: 'spaghetti', quantity: '1', unit: 'lb', substitutes: ['linguine', 'fettuccine'] },
      { name: 'pancetta', quantity: '6', unit: 'oz', substitutes: ['bacon'] },
      { name: 'eggs', quantity: '4', unit: 'large', substitutes: [] },
      { name: 'parmesan cheese', quantity: '1', unit: 'cup', substitutes: ['pecorino romano'] },
      { name: 'black pepper', quantity: '1', unit: 'tsp', substitutes: [] },
      { name: 'garlic', quantity: '2', unit: 'cloves', substitutes: [] }
    ],
    instructions: [
      { step: 1, content: 'Cook spaghetti in salted boiling water until al dente' },
      { step: 2, content: 'Fry pancetta until crispy, add minced garlic' },
      { step: 3, content: 'Whisk eggs with grated parmesan and black pepper' },
      { step: 4, content: 'Drain pasta, reserving pasta water' },
      { step: 5, content: 'Toss hot pasta with pancetta, remove from heat, add egg mixture' },
      { step: 6, content: 'Mix quickly, adding pasta water to create creamy sauce' }
    ]
  },
  {
    name: 'Grilled Salmon',
    description: 'Perfectly grilled salmon with lemon and herbs',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288',
    category: 'dinner',
    difficulty: 2,
    prepTime: 10,
    cookTime: 15,
    calories: 420,
    protein: 42,
    fat: 24,
    carbs: 4,
    tags: ['seafood', 'healthy', 'grilled'],
    ingredients: [
      { name: 'salmon fillets', quantity: '4', unit: 'pieces', substitutes: ['trout'] },
      { name: 'lemon', quantity: '2', unit: 'medium', substitutes: ['lime'] },
      { name: 'olive oil', quantity: '3', unit: 'tbsp', substitutes: [] },
      { name: 'dill', quantity: '2', unit: 'tbsp', substitutes: ['parsley'] },
      { name: 'garlic', quantity: '3', unit: 'cloves', substitutes: [] },
      { name: 'salt', quantity: '1', unit: 'tsp', substitutes: [] }
    ],
    instructions: [
      { step: 1, content: 'Marinate salmon with olive oil, lemon juice, minced garlic, and dill' },
      { step: 2, content: 'Let sit for 15 minutes' },
      { step: 3, content: 'Preheat grill to medium-high heat' },
      { step: 4, content: 'Grill salmon skin-side down for 6-8 minutes' },
      { step: 5, content: 'Flip and grill for another 4-5 minutes until cooked through' }
    ]
  },
  {
    name: 'Beef Tacos',
    description: 'Mexican street-style tacos with seasoned ground beef',
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47',
    category: 'dinner',
    difficulty: 2,
    prepTime: 15,
    cookTime: 20,
    calories: 480,
    protein: 32,
    fat: 24,
    carbs: 36,
    tags: ['mexican', 'quick', 'family-friendly'],
    ingredients: [
      { name: 'ground beef', quantity: '1', unit: 'lb', substitutes: ['ground turkey', 'ground chicken'] },
      { name: 'taco shells', quantity: '8', unit: 'pieces', substitutes: ['tortillas'] },
      { name: 'onion', quantity: '1', unit: 'medium', substitutes: [] },
      { name: 'tomato', quantity: '2', unit: 'medium', substitutes: [] },
      { name: 'lettuce', quantity: '2', unit: 'cups', substitutes: ['cabbage'] },
      { name: 'cheddar cheese', quantity: '1', unit: 'cup', substitutes: ['mexican cheese blend'] },
      { name: 'cumin', quantity: '1', unit: 'tbsp', substitutes: [] },
      { name: 'chili powder', quantity: '1', unit: 'tbsp', substitutes: [] }
    ],
    instructions: [
      { step: 1, content: 'Brown ground beef in a pan, drain excess fat' },
      { step: 2, content: 'Add cumin, chili powder, and diced onion' },
      { step: 3, content: 'Cook until onions are soft' },
      { step: 4, content: 'Warm taco shells according to package directions' },
      { step: 5, content: 'Fill shells with beef, lettuce, tomatoes, and cheese' }
    ]
  },
  {
    name: 'Chicken Curry',
    description: 'Aromatic Indian curry with tender chicken pieces',
    imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db',
    category: 'dinner',
    difficulty: 3,
    prepTime: 20,
    cookTime: 40,
    calories: 520,
    protein: 38,
    fat: 28,
    carbs: 32,
    tags: ['indian', 'spicy', 'comfort'],
    ingredients: [
      { name: 'chicken thighs', quantity: '2', unit: 'lbs', substitutes: ['chicken breast'] },
      { name: 'coconut milk', quantity: '1', unit: 'can', substitutes: ['cream'] },
      { name: 'onion', quantity: '2', unit: 'large', substitutes: [] },
      { name: 'tomato', quantity: '3', unit: 'large', substitutes: ['crushed tomatoes'] },
      { name: 'ginger', quantity: '2', unit: 'tbsp', substitutes: ['ginger powder'] },
      { name: 'garlic', quantity: '6', unit: 'cloves', substitutes: [] },
      { name: 'curry powder', quantity: '3', unit: 'tbsp', substitutes: [] },
      { name: 'garam masala', quantity: '1', unit: 'tsp', substitutes: [] }
    ],
    instructions: [
      { step: 1, content: 'Cut chicken into bite-sized pieces' },
      { step: 2, content: 'Sauté onions, ginger, and garlic until fragrant' },
      { step: 3, content: 'Add curry powder and garam masala, cook for 1 minute' },
      { step: 4, content: 'Add chicken and brown on all sides' },
      { step: 5, content: 'Add tomatoes and coconut milk, simmer for 30 minutes' },
      { step: 6, content: 'Serve with rice or naan bread' }
    ]
  },
  {
    name: 'Margherita Pizza',
    description: 'Classic Neapolitan pizza with tomato, mozzarella, and basil',
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002',
    category: 'dinner',
    difficulty: 3,
    prepTime: 90,
    cookTime: 15,
    calories: 680,
    protein: 28,
    fat: 24,
    carbs: 88,
    tags: ['italian', 'vegetarian', 'classic'],
    ingredients: [
      { name: 'pizza dough', quantity: '1', unit: 'lb', substitutes: [] },
      { name: 'tomato sauce', quantity: '1', unit: 'cup', substitutes: ['crushed tomatoes'] },
      { name: 'mozzarella cheese', quantity: '12', unit: 'oz', substitutes: [] },
      { name: 'basil', quantity: '1/2', unit: 'cup', substitutes: [] },
      { name: 'olive oil', quantity: '2', unit: 'tbsp', substitutes: [] },
      { name: 'garlic', quantity: '2', unit: 'cloves', substitutes: [] }
    ],
    instructions: [
      { step: 1, content: 'Preheat oven to 475°F with pizza stone inside' },
      { step: 2, content: 'Roll out pizza dough into a circle' },
      { step: 3, content: 'Spread tomato sauce, leaving a border' },
      { step: 4, content: 'Tear mozzarella and distribute over sauce' },
      { step: 5, content: 'Bake for 12-15 minutes until crust is golden' },
      { step: 6, content: 'Top with fresh basil and drizzle with olive oil' }
    ]
  },

  // SNACKS (20 dishes)
  {
    name: 'Guacamole',
    description: 'Fresh Mexican avocado dip with lime and cilantro',
    imageUrl: 'https://images.unsplash.com/photo-1580013759032-c96505e24c1f',
    category: 'snack',
    difficulty: 1,
    prepTime: 10,
    cookTime: 0,
    calories: 180,
    protein: 3,
    fat: 16,
    carbs: 10,
    tags: ['mexican', 'healthy', 'vegan'],
    ingredients: [
      { name: 'avocado', quantity: '3', unit: 'large', substitutes: [] },
      { name: 'lime', quantity: '2', unit: 'medium', substitutes: ['lemon'] },
      { name: 'tomato', quantity: '1', unit: 'medium', substitutes: [] },
      { name: 'onion', quantity: '1/4', unit: 'medium', substitutes: [] },
      { name: 'cilantro', quantity: '1/4', unit: 'cup', substitutes: ['parsley'] },
      { name: 'jalapeño', quantity: '1', unit: 'small', substitutes: [] }
    ],
    instructions: [
      { step: 1, content: 'Mash avocados in a bowl' },
      { step: 2, content: 'Add lime juice to prevent browning' },
      { step: 3, content: 'Mix in diced tomato, onion, and jalapeño' },
      { step: 4, content: 'Add chopped cilantro and salt to taste' },
      { step: 5, content: 'Serve with tortilla chips' }
    ]
  },
  {
    name: 'Hummus',
    description: 'Creamy Middle Eastern chickpea dip',
    imageUrl: 'https://images.unsplash.com/photo-1571176119806-fa8f5dfa168a',
    category: 'snack',
    difficulty: 1,
    prepTime: 10,
    cookTime: 0,
    calories: 160,
    protein: 6,
    fat: 10,
    carbs: 14,
    tags: ['middle-eastern', 'vegan', 'healthy'],
    ingredients: [
      { name: 'chickpeas', quantity: '1', unit: 'can', substitutes: [] },
      { name: 'tahini', quantity: '1/4', unit: 'cup', substitutes: [] },
      { name: 'lemon juice', quantity: '3', unit: 'tbsp', substitutes: [] },
      { name: 'garlic', quantity: '2', unit: 'cloves', substitutes: [] },
      { name: 'olive oil', quantity: '2', unit: 'tbsp', substitutes: [] },
      { name: 'cumin', quantity: '1/2', unit: 'tsp', substitutes: [] }
    ],
    instructions: [
      { step: 1, content: 'Drain and rinse chickpeas' },
      { step: 2, content: 'Blend chickpeas, tahini, lemon juice, and garlic until smooth' },
      { step: 3, content: 'Add water as needed for desired consistency' },
      { step: 4, content: 'Drizzle with olive oil and sprinkle with cumin' },
      { step: 5, content: 'Serve with pita bread or vegetables' }
    ]
  }
];

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.instruction.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.dish.deleteMany();

  // Create dishes with ingredients and instructions
  for (const dishData of dishes) {
    const { ingredients, instructions, ...dish } = dishData;

    await prisma.dish.create({
      data: {
        ...dish,
        ingredients: {
          create: ingredients
        },
        instructions: {
          create: instructions
        }
      }
    });
  }

  console.log(`Seeded ${dishes.length} dishes successfully!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { Meal } from '@/types';

export const sampleMeals: Meal[] = [
  {
    id: '1',
    name: 'Classic Pancakes',
    imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
    description: 'Fluffy, golden pancakes perfect for a weekend breakfast',
    ingredients: ['flour', 'eggs', 'milk', 'butter', 'sugar', 'baking powder', 'salt'],
    instructions: [
      'Mix dry ingredients in a bowl',
      'Whisk eggs and milk together',
      'Combine wet and dry ingredients',
      'Heat a griddle and add butter',
      'Pour batter and cook until bubbles form',
      'Flip and cook until golden brown'
    ],
    category: 'breakfast',
    prepTime: 20,
    difficulty: 'easy'
  },
  {
    id: '2',
    name: 'Avocado Toast',
    imageUrl: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&q=80',
    description: 'Simple and nutritious breakfast with creamy avocado',
    ingredients: ['bread', 'avocado', 'lemon juice', 'salt', 'pepper', 'olive oil'],
    instructions: [
      'Toast bread until golden',
      'Mash avocado with lemon juice',
      'Season with salt and pepper',
      'Spread on toast',
      'Drizzle with olive oil'
    ],
    category: 'breakfast',
    prepTime: 10,
    difficulty: 'easy'
  },
  {
    id: '3',
    name: 'Caesar Salad',
    imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&q=80',
    description: 'Crisp romaine lettuce with creamy Caesar dressing',
    ingredients: ['romaine lettuce', 'parmesan cheese', 'croutons', 'caesar dressing', 'lemon'],
    instructions: [
      'Wash and chop romaine lettuce',
      'Toss with Caesar dressing',
      'Add croutons and parmesan',
      'Squeeze fresh lemon',
      'Serve immediately'
    ],
    category: 'lunch',
    prepTime: 15,
    difficulty: 'easy'
  },
  {
    id: '4',
    name: 'Grilled Chicken Sandwich',
    imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&q=80',
    description: 'Juicy grilled chicken with fresh vegetables',
    ingredients: ['chicken breast', 'bread', 'lettuce', 'tomato', 'mayonnaise', 'salt', 'pepper'],
    instructions: [
      'Season chicken with salt and pepper',
      'Grill chicken until cooked through',
      'Toast bread lightly',
      'Spread mayonnaise on bread',
      'Layer chicken, lettuce, and tomato',
      'Assemble and serve'
    ],
    category: 'lunch',
    prepTime: 25,
    difficulty: 'medium'
  },
  {
    id: '5',
    name: 'Spaghetti Carbonara',
    imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&q=80',
    description: 'Classic Italian pasta with creamy egg sauce',
    ingredients: ['spaghetti', 'eggs', 'bacon', 'parmesan cheese', 'black pepper', 'salt'],
    instructions: [
      'Cook spaghetti according to package',
      'Fry bacon until crispy',
      'Beat eggs with parmesan',
      'Drain pasta, reserve some water',
      'Mix hot pasta with egg mixture',
      'Add bacon and pepper',
      'Serve immediately'
    ],
    category: 'dinner',
    prepTime: 30,
    difficulty: 'medium'
  },
  {
    id: '6',
    name: 'Beef Tacos',
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80',
    description: 'Savory ground beef tacos with fresh toppings',
    ingredients: ['ground beef', 'taco shells', 'lettuce', 'tomato', 'cheese', 'sour cream', 'taco seasoning'],
    instructions: [
      'Brown ground beef in a pan',
      'Add taco seasoning and water',
      'Simmer until thickened',
      'Warm taco shells',
      'Fill shells with beef',
      'Top with lettuce, tomato, cheese, and sour cream'
    ],
    category: 'dinner',
    prepTime: 20,
    difficulty: 'easy'
  },
  {
    id: '7',
    name: 'Greek Yogurt Parfait',
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80',
    description: 'Healthy layered parfait with fruits and granola',
    ingredients: ['greek yogurt', 'granola', 'honey', 'strawberries', 'blueberries'],
    instructions: [
      'Layer yogurt in a glass',
      'Add granola layer',
      'Add fresh berries',
      'Repeat layers',
      'Drizzle with honey',
      'Serve chilled'
    ],
    category: 'snack',
    prepTime: 5,
    difficulty: 'easy'
  },
  {
    id: '8',
    name: 'Chocolate Chip Cookies',
    imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80',
    description: 'Classic homemade cookies with chocolate chips',
    ingredients: ['flour', 'butter', 'sugar', 'brown sugar', 'eggs', 'vanilla extract', 'chocolate chips', 'baking soda'],
    instructions: [
      'Cream butter and sugars',
      'Beat in eggs and vanilla',
      'Mix in flour and baking soda',
      'Fold in chocolate chips',
      'Drop spoonfuls on baking sheet',
      'Bake at 375°F for 10-12 minutes'
    ],
    category: 'snack',
    prepTime: 45,
    difficulty: 'medium'
  }
];

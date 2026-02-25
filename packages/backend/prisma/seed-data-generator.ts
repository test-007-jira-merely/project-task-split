// Generates additional dishes to supplement the seed data
export const generateAdditionalDishes = () => {
  const additionalDishes = [];
  
  // Generate variations of popular dishes
  const templates = [
    // More breakfast items
    { base: 'Scrambled Eggs', category: 'breakfast', variations: ['with Cheese', 'with Herbs', 'with Mushrooms'] },
    { base: 'Bagel', category: 'breakfast', variations: ['with Cream Cheese', 'with Lox', 'with Avocado'] },
    { base: 'Smoothie Bowl', category: 'breakfast', variations: ['Berry', 'Tropical', 'Green'] },
    { base: 'Breakfast Burrito', category: 'breakfast', variations: ['Chorizo', 'Vegetarian', 'Bacon'] },
    
    // More lunch items
    { base: 'Wrap', category: 'lunch', variations: ['Chicken Caesar', 'Veggie', 'Turkey Club'] },
    { base: 'Soup', category: 'lunch', variations: ['Tomato', 'Chicken Noodle', 'Minestrone', 'Lentil'] },
    { base: 'Buddha Bowl', category: 'lunch', variations: ['Mediterranean', 'Asian', 'Mexican'] },
    
    // More dinner items  
    { base: 'Risotto', category: 'dinner', variations: ['Mushroom', 'Seafood', 'Butternut Squash'] },
    { base: 'Steak', category: 'dinner', variations: ['with Chimichurri', 'with Peppercorn Sauce', 'Teriyaki'] },
    { base: 'Lasagna', category: 'dinner', variations: ['Meat', 'Vegetarian', 'Seafood'] },
    { base: 'Curry', category: 'dinner', variations: ['Thai Green', 'Indian Butter', 'Japanese'] },
    
    // More snacks
    { base: 'Energy Balls', category: 'snack', variations: ['Chocolate Peanut Butter', 'Coconut Date', 'Almond'] },
    { base: 'Chips', category: 'snack', variations: ['Tortilla with Salsa', 'Pita with Tzatziki', 'Sweet Potato'] }
  ];
  
  templates.forEach(template => {
    template.variations.forEach((variation, idx) => {
      const dishName = `${template.base} ${variation}`;
      additionalDishes.push({
        name: dishName,
        description: `Delicious ${dishName.toLowerCase()}`,
        imageUrl: `https://images.unsplash.com/photo-${1500000000000 + idx}`,
        category: template.category,
        difficulty: Math.ceil(Math.random() * 3) + 1,
        prepTime: Math.ceil(Math.random() * 20) + 5,
        cookTime: Math.ceil(Math.random() * 30) + 10,
        calories: Math.ceil(Math.random() * 400) + 200,
        protein: Math.ceil(Math.random() * 30) + 10,
        fat: Math.ceil(Math.random() * 20) + 5,
        carbs: Math.ceil(Math.random() * 50) + 20,
        tags: [template.category, 'popular'],
        ingredients: generateIngredients(template.category),
        instructions: generateInstructions(3)
      });
    });
  });
  
  return additionalDishes;
};

const generateIngredients = (category: string) => {
  const commonIngredients = [
    { name: 'salt', quantity: '1', unit: 'tsp' },
    { name: 'pepper', quantity: '1/2', unit: 'tsp' },
    { name: 'olive oil', quantity: '2', unit: 'tbsp' }
  ];
  
  const categoryIngredients = {
    breakfast: [
      { name: 'eggs', quantity: '2', unit: 'large' },
      { name: 'butter', quantity: '1', unit: 'tbsp' }
    ],
    lunch: [
      { name: 'lettuce', quantity: '2', unit: 'cups' },
      { name: 'tomato', quantity: '1', unit: 'medium' }
    ],
    dinner: [
      { name: 'onion', quantity: '1', unit: 'medium' },
      { name: 'garlic', quantity: '3', unit: 'cloves' }
    ],
    snack: [
      { name: 'honey', quantity: '2', unit: 'tbsp' }
    ]
  };
  
  return [...(categoryIngredients[category] || []), ...commonIngredients.slice(0, 2)].map(ing => ({
    ...ing,
    substitutes: []
  }));
};

const generateInstructions = (count: number) => {
  const steps = [
    'Prepare all ingredients',
    'Heat pan over medium heat',
    'Combine ingredients in bowl',
    'Cook until done',
    'Season to taste and serve'
  ];
  
  return steps.slice(0, count).map((content, idx) => ({
    step: idx + 1,
    content
  }));
};

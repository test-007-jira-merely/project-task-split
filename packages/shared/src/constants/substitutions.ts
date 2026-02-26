/**
 * Ingredient substitution matrix
 * Maps ingredient families with confidence scores
 */
export const SUBSTITUTION_GROUPS = {
  ONION_FAMILY: {
    items: ['onion', 'yellow onion', 'white onion', 'red onion', 'shallot', 'scallion', 'green onion', 'leek'],
    confidence: 0.9,
  },
  GARLIC_FAMILY: {
    items: ['garlic', 'garlic powder', 'garlic paste', 'minced garlic'],
    confidence: 0.85,
  },
  TOMATO_FAMILY: {
    items: ['tomato', 'cherry tomato', 'roma tomato', 'plum tomato', 'canned tomato', 'tomato paste', 'tomato sauce'],
    confidence: 0.8,
  },
  PROTEIN_CHICKEN: {
    items: ['chicken breast', 'chicken thigh', 'chicken tender', 'rotisserie chicken'],
    confidence: 0.9,
  },
  PROTEIN_BEEF: {
    items: ['ground beef', 'beef chuck', 'beef sirloin', 'stew beef', 'beef mince'],
    confidence: 0.85,
  },
  PROTEIN_PORK: {
    items: ['pork chop', 'pork tenderloin', 'pork shoulder', 'ground pork'],
    confidence: 0.85,
  },
  HERBS_BASIL: {
    items: ['basil', 'fresh basil', 'dried basil', 'thai basil'],
    confidence: 0.75,
  },
  HERBS_PARSLEY: {
    items: ['parsley', 'fresh parsley', 'dried parsley', 'cilantro'],
    confidence: 0.7,
  },
  HERBS_OREGANO: {
    items: ['oregano', 'fresh oregano', 'dried oregano', 'italian seasoning'],
    confidence: 0.75,
  },
  DAIRY_MILK: {
    items: ['milk', 'whole milk', '2% milk', 'skim milk', 'almond milk', 'oat milk', 'soy milk'],
    confidence: 0.8,
  },
  DAIRY_CHEESE: {
    items: ['cheddar cheese', 'mozzarella', 'parmesan', 'swiss cheese', 'provolone'],
    confidence: 0.7,
  },
  OIL_COOKING: {
    items: ['olive oil', 'vegetable oil', 'canola oil', 'sunflower oil', 'grapeseed oil'],
    confidence: 0.9,
  },
  VINEGAR: {
    items: ['white vinegar', 'apple cider vinegar', 'red wine vinegar', 'balsamic vinegar'],
    confidence: 0.75,
  },
  PASTA: {
    items: ['spaghetti', 'penne', 'linguine', 'fettuccine', 'rigatoni', 'farfalle'],
    confidence: 0.85,
  },
  RICE: {
    items: ['white rice', 'brown rice', 'basmati rice', 'jasmine rice', 'long grain rice'],
    confidence: 0.85,
  },
  BEANS: {
    items: ['black beans', 'kidney beans', 'pinto beans', 'cannellini beans', 'chickpeas'],
    confidence: 0.8,
  },
  PEPPER: {
    items: ['bell pepper', 'red bell pepper', 'green bell pepper', 'yellow bell pepper', 'orange bell pepper'],
    confidence: 0.9,
  },
  SOY_SAUCE: {
    items: ['soy sauce', 'tamari', 'coconut aminos', 'liquid aminos'],
    confidence: 0.8,
  },
  SUGAR: {
    items: ['sugar', 'white sugar', 'brown sugar', 'cane sugar', 'honey', 'maple syrup', 'agave'],
    confidence: 0.75,
  },
  FLOUR: {
    items: ['all-purpose flour', 'bread flour', 'whole wheat flour', 'cake flour'],
    confidence: 0.8,
  },
  STOCK: {
    items: ['chicken stock', 'chicken broth', 'vegetable stock', 'vegetable broth', 'beef stock', 'beef broth'],
    confidence: 0.85,
  },
};

/**
 * Common ingredient synonyms for normalization
 */
export const INGREDIENT_SYNONYMS: Record<string, string[]> = {
  'tomato': ['tomatoes'],
  'potato': ['potatoes'],
  'onion': ['onions'],
  'garlic': ['garlic cloves', 'clove of garlic'],
  'pepper': ['peppers'],
  'carrot': ['carrots'],
  'egg': ['eggs'],
  'chicken': ['chicken breast', 'chicken breasts'],
  'salt': ['sea salt', 'kosher salt', 'table salt'],
  'pepper': ['black pepper', 'ground pepper'],
};

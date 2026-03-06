export const normalizeString = (input: string): string => {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' '); // Normalize whitespace
};

export const normalizeIngredients = (ingredients: string[]): string[] => {
  const normalized = ingredients.map(normalizeString);
  return Array.from(new Set(normalized)).filter(i => i.length > 0);
};

export const ingredientsMatch = (ingredient1: string, ingredient2: string): boolean => {
  const norm1 = normalizeString(ingredient1);
  const norm2 = normalizeString(ingredient2);

  // Exact match
  if (norm1 === norm2) return true;

  // Partial match (one contains the other)
  if (norm1.includes(norm2) || norm2.includes(norm1)) return true;

  return false;
};

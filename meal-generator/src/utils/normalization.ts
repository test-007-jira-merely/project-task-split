export const normalizeString = (str: string): string => {
  return str.trim().toLowerCase().replace(/\s+/g, ' ');
};

export const normalizeIngredients = (ingredients: string[]): string[] => {
  const normalized = ingredients.map(normalizeString);
  return Array.from(new Set(normalized)).filter(Boolean);
};

export const ingredientsMatch = (ingredient1: string, ingredient2: string): boolean => {
  const norm1 = normalizeString(ingredient1);
  const norm2 = normalizeString(ingredient2);

  return norm1 === norm2 || norm1.includes(norm2) || norm2.includes(norm1);
};

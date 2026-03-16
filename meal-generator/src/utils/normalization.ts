export const normalizeString = (str: string): string => {
  return str.toLowerCase().trim().replace(/\s+/g, ' ');
};

export const normalizeIngredients = (ingredients: string[]): string[] => {
  return [...new Set(ingredients.map(normalizeString))];
};

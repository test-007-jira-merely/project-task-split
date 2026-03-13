export const normalizeString = (str: string): string => {
  return str.toLowerCase().trim();
};

export const normalizeIngredient = (ingredient: string): string => {
  return normalizeString(ingredient)
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ');
};

export const deduplicateArray = <T>(arr: T[]): T[] => {
  return [...new Set(arr)];
};

export const normalizeIngredientList = (ingredients: string[]): string[] => {
  return deduplicateArray(
    ingredients.map(normalizeIngredient).filter(Boolean)
  );
};

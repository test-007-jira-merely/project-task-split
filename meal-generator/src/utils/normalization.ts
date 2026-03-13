export function normalizeString(str: string): string {
  return str.toLowerCase().trim().replace(/\s+/g, ' ');
}

export function normalizeIngredient(ingredient: string): string {
  return normalizeString(ingredient)
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

export function normalizeIngredients(ingredients: string[]): string[] {
  const normalized = ingredients.map(normalizeIngredient).filter(i => i.length > 0);
  return Array.from(new Set(normalized));
}

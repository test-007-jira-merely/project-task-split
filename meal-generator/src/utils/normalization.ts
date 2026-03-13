export function normalizeString(str: string): string {
  return str.toLowerCase().trim().replace(/\s+/g, ' ');
}

export function normalizeIngredients(ingredients: string[]): string[] {
  const normalized = ingredients.map(normalizeString);
  return Array.from(new Set(normalized)).filter(Boolean);
}

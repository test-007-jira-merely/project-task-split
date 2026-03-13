export function normalizeString(str: string): string {
  return str.toLowerCase().trim().replace(/\s+/g, ' ');
}

export function removeDuplicates<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

export function normalizeIngredients(ingredients: string[]): string[] {
  return removeDuplicates(
    ingredients
      .map(normalizeString)
      .filter(ingredient => ingredient.length > 0)
  );
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const normalizeIngredient = (ingredient: string): string => {
  return ingredient.toLowerCase().trim().replace(/\s+/g, ' ');
};

export const calculateMatchPercentage = (
  availableIngredients: string[],
  requiredIngredients: string[]
): number => {
  if (requiredIngredients.length === 0) return 0;

  const normalizedAvailable = availableIngredients.map(normalizeIngredient);
  const normalizedRequired = requiredIngredients.map(normalizeIngredient);

  const matchCount = normalizedRequired.filter(req =>
    normalizedAvailable.some(avail => avail.includes(req) || req.includes(avail))
  ).length;

  return Math.round((matchCount / normalizedRequired.length) * 100);
};

export const getMatchedIngredients = (
  availableIngredients: string[],
  requiredIngredients: string[]
): string[] => {
  const normalizedAvailable = availableIngredients.map(normalizeIngredient);

  return requiredIngredients.filter(req => {
    const normalizedReq = normalizeIngredient(req);
    return normalizedAvailable.some(avail =>
      avail.includes(normalizedReq) || normalizedReq.includes(avail)
    );
  });
};

export const getMissingIngredients = (
  availableIngredients: string[],
  requiredIngredients: string[]
): string[] => {
  const matched = getMatchedIngredients(availableIngredients, requiredIngredients);
  return requiredIngredients.filter(req => !matched.includes(req));
};

export const getIngredientSuggestions = (
  allIngredients: string[],
  searchTerm: string
): string[] => {
  if (!searchTerm) return [];

  const normalized = normalizeIngredient(searchTerm);
  const unique = Array.from(new Set(allIngredients.map(normalizeIngredient)));

  return unique
    .filter(ingredient => ingredient.includes(normalized))
    .slice(0, 10);
};

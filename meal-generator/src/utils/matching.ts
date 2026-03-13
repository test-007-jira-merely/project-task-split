export const normalizeString = (str: string): string => {
  return str.toLowerCase().trim()
}

export const normalizeIngredients = (ingredients: string[]): string[] => {
  const normalized = ingredients.map(normalizeString)
  return Array.from(new Set(normalized)).filter(Boolean)
}

export const calculateMatchPercentage = (
  mealIngredients: string[],
  availableIngredients: string[]
): number => {
  if (!mealIngredients.length) return 0

  const normalizedMeal = normalizeIngredients(mealIngredients)
  const normalizedAvailable = normalizeIngredients(availableIngredients)

  const matches = normalizedMeal.filter(ingredient =>
    normalizedAvailable.some(available =>
      ingredient.includes(available) || available.includes(ingredient)
    )
  )

  return Math.round((matches.length / normalizedMeal.length) * 100)
}

export const canCookMeal = (
  mealIngredients: string[],
  availableIngredients: string[]
): boolean => {
  return calculateMatchPercentage(mealIngredients, availableIngredients) === 100
}

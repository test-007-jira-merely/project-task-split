export interface IngredientSubstitution {
  id: string;
  ingredientName: string;
  substitutes: string[];
  category?: string;
}

export interface IngredientInput {
  name: string;
  amount?: string;
}

export interface NormalizedIngredient {
  original: string;
  normalized: string;
  tokens: string[];
}

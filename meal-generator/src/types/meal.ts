export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack'
export type MealDifficulty = 'easy' | 'medium' | 'hard'

export interface Meal {
  id: string
  name: string
  imageUrl: string
  description: string
  ingredients: string[]
  instructions: string[]
  category: MealCategory
  preparationTime?: number
  difficulty?: MealDifficulty
}

export interface MealWithMatch extends Meal {
  matchPercentage?: number
}

export interface Favorite {
  id: string
  userId: string
  mealId: string
  createdAt: string
}

export interface HistoryEntry {
  id: string
  userId: string
  mealId: string
  generatedAt: string
}

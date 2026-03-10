export interface Meal {
  id: string;
  name: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  difficulty: 'easy' | 'medium' | 'hard';
  prepTime: number;
  imageUrl: string;
  ingredients: string[];
  instructions: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
}

export interface Favorite {
  id: string;
  userId: string;
  mealId: string;
  createdAt: string;
}

export interface UserHistory {
  id: string;
  userId: string;
  mealId: string;
  viewedAt: string;
}

export interface Meal {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string;
  prep_time: number; // in minutes
  cook_time: number; // in minutes
  image_url?: string;
  is_favorite: boolean;
  tags: string[];
  created_at: string;
}

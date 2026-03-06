// Supabase database schema types and service interface

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          is_admin: boolean;
        };
        Insert: {
          id: string;
          email: string;
          created_at?: string;
          is_admin?: boolean;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          is_admin?: boolean;
        };
      };
      meals: {
        Row: {
          id: string;
          name: string;
          description: string;
          image_url: string;
          ingredients: string[];
          instructions: string[];
          category: string;
          preparation_time: number | null;
          difficulty: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          image_url: string;
          ingredients: string[];
          instructions: string[];
          category: string;
          preparation_time?: number | null;
          difficulty?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          image_url?: string;
          ingredients?: string[];
          instructions?: string[];
          category?: string;
          preparation_time?: number | null;
          difficulty?: string | null;
          created_at?: string;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          meal_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          meal_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          meal_id?: string;
          created_at?: string;
        };
      };
      user_history: {
        Row: {
          id: string;
          user_id: string;
          meal_id: string;
          generated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          meal_id: string;
          generated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          meal_id?: string;
          generated_at?: string;
        };
      };
    };
  };
}

// SQL schema for Supabase setup
export const SUPABASE_SCHEMA = `
-- Users table (extended from auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_admin BOOLEAN DEFAULT FALSE
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Meals table
CREATE TABLE public.meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  ingredients TEXT[] NOT NULL,
  instructions TEXT[] NOT NULL,
  category TEXT NOT NULL,
  preparation_time INTEGER,
  difficulty TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;

-- Anyone can read meals
CREATE POLICY "Anyone can read meals" ON public.meals
  FOR SELECT USING (true);

-- Only admins can insert/update/delete meals
CREATE POLICY "Admins can insert meals" ON public.meals
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update meals" ON public.meals
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can delete meals" ON public.meals
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Favorites table
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  meal_id UUID NOT NULL REFERENCES public.meals(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, meal_id)
);

-- Enable RLS
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Users can manage their own favorites
CREATE POLICY "Users can read own favorites" ON public.favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON public.favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON public.favorites
  FOR DELETE USING (auth.uid() = user_id);

-- User history table
CREATE TABLE public.user_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  meal_id UUID NOT NULL REFERENCES public.meals(id) ON DELETE CASCADE,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_history ENABLE ROW LEVEL SECURITY;

-- Users can manage their own history
CREATE POLICY "Users can read own history" ON public.user_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own history" ON public.user_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX idx_favorites_meal_id ON public.favorites(meal_id);
CREATE INDEX idx_user_history_user_id ON public.user_history(user_id);
CREATE INDEX idx_user_history_meal_id ON public.user_history(meal_id);
CREATE INDEX idx_meals_category ON public.meals(category);
`;

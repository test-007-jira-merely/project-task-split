-- Users table (managed by Supabase Auth)

-- Meals table
CREATE TABLE meals (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  ingredients TEXT[] NOT NULL,
  instructions TEXT[] NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('breakfast', 'lunch', 'dinner', 'snack')),
  prep_time INTEGER,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Favorites table
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, meal_id)
);

-- User history table
CREATE TABLE user_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_id TEXT NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_history_user_id ON user_history(user_id);
CREATE INDEX idx_history_generated_at ON user_history(generated_at DESC);

-- RLS Policies
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_history ENABLE ROW LEVEL SECURITY;

-- Meals: public read, authenticated write
CREATE POLICY "Meals are viewable by everyone" ON meals FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert meals" ON meals FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update meals" ON meals FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete meals" ON meals FOR DELETE USING (auth.role() = 'authenticated');

-- Favorites: users can only manage their own
CREATE POLICY "Users can view their own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- History: users can only manage their own
CREATE POLICY "Users can view their own history" ON user_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own history" ON user_history FOR INSERT WITH CHECK (auth.uid() = user_id);

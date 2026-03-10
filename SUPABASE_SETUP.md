# Supabase Setup Guide

This guide will help you set up Supabase for the Meal Planner application.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Basic knowledge of SQL

## Step 1: Create a New Supabase Project

1. Log in to your Supabase account
2. Click "New Project"
3. Enter your project details:
   - Name: `meal-planner`
   - Database Password: (choose a secure password)
   - Region: (select closest to your users)
4. Click "Create New Project"
5. Wait for the project to be provisioned (usually 1-2 minutes)

## Step 2: Create Database Tables

Navigate to the SQL Editor in your Supabase dashboard and run the following SQL commands:

### Create Meals Table

```sql
-- Create meals table
CREATE TABLE meals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('breakfast', 'lunch', 'dinner', 'snack')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  prep_time INTEGER NOT NULL CHECK (prep_time > 0),
  image_url TEXT NOT NULL,
  ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
  instructions JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX idx_meals_category ON meals(category);
CREATE INDEX idx_meals_difficulty ON meals(difficulty);
CREATE INDEX idx_meals_created_at ON meals(created_at DESC);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function
CREATE TRIGGER update_meals_updated_at
  BEFORE UPDATE ON meals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Create Favorites Table

```sql
-- Create favorites table
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_id UUID NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(user_id, meal_id)
);

-- Create index for faster queries
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_meal_id ON favorites(meal_id);
```

### Create User History Table

```sql
-- Create user_history table
CREATE TABLE user_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_id UUID NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX idx_user_history_user_id ON user_history(user_id);
CREATE INDEX idx_user_history_meal_id ON user_history(meal_id);
CREATE INDEX idx_user_history_viewed_at ON user_history(viewed_at DESC);
```

## Step 3: Set Up Row Level Security (RLS)

### Enable RLS on Tables

```sql
-- Enable RLS
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_history ENABLE ROW LEVEL SECURITY;
```

### Create RLS Policies for Meals Table

```sql
-- Meals: Everyone can read
CREATE POLICY "Anyone can read meals"
  ON meals
  FOR SELECT
  USING (true);

-- Meals: Only authenticated users can insert (can be restricted to admin only)
CREATE POLICY "Authenticated users can insert meals"
  ON meals
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Meals: Only authenticated users can update
CREATE POLICY "Authenticated users can update meals"
  ON meals
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Meals: Only authenticated users can delete
CREATE POLICY "Authenticated users can delete meals"
  ON meals
  FOR DELETE
  USING (auth.role() = 'authenticated');
```

### Create RLS Policies for Favorites Table

```sql
-- Favorites: Users can only read their own favorites
CREATE POLICY "Users can read their own favorites"
  ON favorites
  FOR SELECT
  USING (auth.uid() = user_id);

-- Favorites: Users can only insert their own favorites
CREATE POLICY "Users can insert their own favorites"
  ON favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Favorites: Users can only delete their own favorites
CREATE POLICY "Users can delete their own favorites"
  ON favorites
  FOR DELETE
  USING (auth.uid() = user_id);
```

### Create RLS Policies for User History Table

```sql
-- User History: Users can only read their own history
CREATE POLICY "Users can read their own history"
  ON user_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- User History: Users can only insert their own history
CREATE POLICY "Users can insert their own history"
  ON user_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User History: Users can delete their own history
CREATE POLICY "Users can delete their own history"
  ON user_history
  FOR DELETE
  USING (auth.uid() = user_id);
```

## Step 4: Configure Authentication

### Enable Email Authentication

1. Go to Authentication > Providers in your Supabase dashboard
2. Enable "Email" provider
3. Configure email templates if desired
4. Save changes

### Optional: Enable OAuth Providers

You can also enable social login providers:
- Google
- GitHub
- GitLab
- etc.

Follow the instructions in the Supabase dashboard for each provider.

## Step 5: Get Your API Credentials

1. Go to Settings > API in your Supabase dashboard
2. Copy the following values:
   - Project URL (e.g., `https://xxxxx.supabase.co`)
   - `anon` public key

3. Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 6: Seed Initial Data (Optional)

You can use the Import feature in the admin panel to load the seed data from `seed-data/meals.json`.

Alternatively, you can insert data directly via SQL:

```sql
-- Example: Insert a single meal
INSERT INTO meals (name, category, difficulty, prep_time, image_url, ingredients, instructions)
VALUES (
  'Pancakes',
  'breakfast',
  'easy',
  15,
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445',
  '["1 cup flour", "2 eggs", "1 cup milk"]'::jsonb,
  '["Mix ingredients", "Cook on griddle", "Serve hot"]'::jsonb
);
```

## Step 7: Admin User Setup

To mark a user as an admin, you can add a custom claim or use Supabase's built-in roles:

### Option 1: Add is_admin Column to Users Table

```sql
-- Add is_admin column to auth.users (requires Supabase admin access)
-- Or create a separate admin_users table
CREATE TABLE admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Add your admin user
INSERT INTO admin_users (user_id)
VALUES ('your-user-id-here');
```

### Option 2: Use Custom Claims in JWT

This requires server-side code to set custom claims in the JWT token. Refer to Supabase documentation for details.

## Troubleshooting

### Common Issues

1. **"Invalid API key"**: Make sure your `.env` file has the correct values
2. **"Row level security policy violation"**: Check that RLS policies are correctly set up
3. **"Connection refused"**: Verify your Supabase project is running and the URL is correct

### Testing Your Setup

You can test your Supabase connection using the Supabase SQL Editor or by running queries in your app's console.

## Next Steps

- Import seed data using the admin panel
- Test authentication flow
- Customize RLS policies based on your requirements
- Set up storage buckets if you want to upload images directly to Supabase

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)

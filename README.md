# MealGen - Intelligent Meal Discovery Platform

A modern, production-grade web application for discovering meals through random generation and ingredient-based filtering.

## Features

- 🎲 Random meal generation with smart repeat avoidance
- 🔍 Ingredient-based meal filtering with match percentage
- ❤️ User favorites system
- 📜 Meal generation history tracking
- 🔐 User authentication with Supabase
- 🛡️ Admin panel for content management
- 🌓 Dark/light theme support
- 📱 Fully responsive design
- ♿ Accessibility compliant
- ⚡ Performance optimized

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Backend**: Supabase (Auth + Database)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **Data Fetching**: TanStack Query
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ and npm
- Supabase account and project

## Setup Instructions

### 1. Clone and Install

\`\`\`bash
npm install
\`\`\`

### 2. Supabase Setup

Create a Supabase project at https://supabase.com

Run the following SQL in your Supabase SQL editor:

\`\`\`sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meals table
CREATE TABLE meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  ingredients TEXT[] NOT NULL,
  instructions TEXT[] NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('breakfast', 'lunch', 'dinner', 'snack')),
  preparation_time INTEGER,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create favorites table
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  meal_id UUID NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, meal_id)
);

-- Create user_history table
CREATE TABLE user_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  meal_id UUID NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_history ENABLE ROW LEVEL SECURITY;

-- Policies for users
CREATE POLICY "Users can read their own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (auth.uid() = id);

-- Policies for meals (public read, admin write)
CREATE POLICY "Anyone can read meals" ON meals FOR SELECT USING (true);
CREATE POLICY "Admins can insert meals" ON meals FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update meals" ON meals FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete meals" ON meals FOR DELETE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Policies for favorites
CREATE POLICY "Users can read their own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- Policies for history
CREATE POLICY "Users can read their own history" ON user_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own history" ON user_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
\`\`\`

### 3. Environment Variables

Copy \`.env.local.example\` to \`.env.local\`:

\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Update \`.env.local\` with your Supabase credentials:

\`\`\`
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit http://localhost:5173

### 5. Create Admin User (Optional)

To access the admin panel, update a user's role in Supabase:

\`\`\`sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
\`\`\`

## Usage

### User Features

- **Home**: Generate random meals with one click
- **Ingredients**: Add your available ingredients to find matching recipes
- **Favorites**: Save and manage your favorite meals (requires login)
- **History**: View recently generated meals (requires login)

### Admin Features

- **Manage Meals**: Create, edit, and delete meals
- **Import Data**: Bulk import meals from JSON file

## Project Structure

\`\`\`
src/
├── app/              # App configuration (providers, router)
├── components/       # React components
│   ├── ui/          # Base UI components
│   ├── meal/        # Meal-specific components
│   ├── ingredients/ # Ingredient-specific components
│   ├── admin/       # Admin panel components
│   └── layout/      # Layout components
├── features/        # Feature modules
├── hooks/           # Custom React hooks
├── pages/           # Page components
├── schemas/         # Zod validation schemas
├── services/        # API services
├── stores/          # Zustand stores
├── styles/          # Global styles
├── types/           # TypeScript types
└── utils/           # Utility functions
\`\`\`

## License

MIT

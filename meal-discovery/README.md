# MealGen - Intelligent Meal Discovery Platform

A modern, production-grade meal discovery application built with React, TypeScript, and Supabase.

## Features

- 🎲 Random meal generation
- 🥗 Ingredient-based meal finder
- ❤️ Favorites system
- 📜 Meal history tracking
- 🔐 User authentication
- 🌓 Dark/light theme
- 👨‍💼 Admin dashboard
- 📱 Fully responsive

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Zustand
- Supabase
- React Router
- TanStack Query

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and add your Supabase credentials
4. Run development server: `npm run dev`

## Supabase Setup

Create the following tables in your Supabase project:

### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### meals
```sql
CREATE TABLE meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  ingredients TEXT[] NOT NULL,
  instructions TEXT[] NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT,
  prep_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### favorites
```sql
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  meal_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, meal_id)
);
```

### user_history
```sql
CREATE TABLE user_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  meal_id UUID NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

MIT

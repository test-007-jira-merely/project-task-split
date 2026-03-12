# MealGen - Meal Discovery Platform

A modern web application for discovering meals based on available ingredients.

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4 with dark mode support
- **State Management**: Zustand with persistence
- **Backend**: Supabase (PostgreSQL + Auth)
- **Routing**: React Router DOM 7
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Data Fetching**: TanStack React Query

## Project Structure

```
mealgen-app/
├── public/
│   └── data/
│       └── meals.json          # 105 meal dataset
├── src/
│   ├── app/                    # App initialization and providers
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── meal/               # Meal-specific components
│   │   ├── ingredients/        # Ingredient-specific components
│   │   ├── admin/              # Admin panel components
│   │   └── layout/             # Layout components (Header, Footer, etc.)
│   ├── pages/
│   │   ├── home/               # Home page
│   │   ├── ingredients/        # Ingredient selection page
│   │   ├── favorites/          # Favorites page
│   │   ├── history/            # History page
│   │   ├── admin/              # Admin pages
│   │   └── auth/               # Auth pages (Login, Signup)
│   ├── features/
│   │   ├── meal-generator/     # Meal generation logic
│   │   ├── ingredient-filter/  # Ingredient filtering
│   │   ├── favorites/          # Favorites management
│   │   └── history/            # History tracking
│   ├── stores/
│   │   └── useAppStore.ts      # Zustand global store
│   ├── services/
│   │   └── supabase.ts         # Supabase client and helpers
│   ├── utils/
│   │   └── matching.ts         # Ingredient matching algorithms
│   ├── hooks/                  # Custom React hooks
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── styles/
│   │   └── globals.css         # Global styles and Tailwind directives
│   └── data/                   # Static data files
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript root config
├── tsconfig.app.json           # TypeScript app config
└── package.json                # Dependencies and scripts
```

## Getting Started

### Installation

```bash
npm install
```

### Environment Setup

1. Copy `.env.example` to `.env.local`
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development

```bash
npm run dev
```

App will run at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Supabase Database Schema

### Tables

#### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_admin BOOLEAN DEFAULT false
);
```

#### meals
```sql
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### favorites
```sql
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  meal_id UUID REFERENCES meals(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, meal_id)
);
```

#### user_history
```sql
CREATE TABLE user_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  meal_id UUID REFERENCES meals(id) ON DELETE CASCADE,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS)

Enable RLS on all tables:

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_history ENABLE ROW LEVEL SECURITY;
```

Example policies:

```sql
-- Users can read all meals
CREATE POLICY "Public meals are viewable by everyone"
  ON meals FOR SELECT
  USING (true);

-- Users can only manage their own favorites
CREATE POLICY "Users can manage own favorites"
  ON favorites FOR ALL
  USING (auth.uid() = user_id);

-- Users can only view their own history
CREATE POLICY "Users can view own history"
  ON user_history FOR SELECT
  USING (auth.uid() = user_id);
```

## Features

### Core Features
- 🎲 Random meal generation
- 🥗 Ingredient-based meal matching
- ⭐ Favorites management
- 📜 Generation history
- 🔐 User authentication
- 🌓 Dark mode support
- 📱 Responsive design

### Ingredient Matching
- Fuzzy matching algorithm
- Match percentage calculation
- Filter by category and difficulty
- Sort by match percentage, name, category, or random

### Admin Features (future)
- Add/edit/delete meals
- View user statistics
- Content moderation

## Path Aliases

TypeScript path aliases are configured:

```typescript
import { Meal } from '@/types'
import { supabase } from '@/services/supabase'
import { filterMeals } from '@/utils/matching'
import { useAppStore } from '@/stores/useAppStore'
```

## Theme System

The app supports light and dark modes using Tailwind's class-based dark mode:

- CSS variables defined in `globals.css`
- Theme toggle in Zustand store
- Persisted to localStorage
- Applied to `<html>` element

## State Management

Zustand store (`useAppStore`) manages:
- User authentication state
- Theme preference
- Current meal and last generated meal ID
- All meals and filtered meals
- Selected ingredients
- Favorites and history
- Loading states

State is partially persisted to localStorage (theme and selected ingredients).

## Initial Dataset

The app includes 105 pre-defined meals in `public/data/meals.json` covering:
- 🥞 **Breakfast**: Pancakes, eggs, oatmeal, smoothies, etc. (20 meals)
- 🥗 **Lunch**: Salads, sandwiches, wraps, soups, etc. (20 meals)
- 🍝 **Dinner**: Pasta, grilled meats, stir-fries, curries, etc. (50 meals)
- 🍿 **Snacks**: Trail mix, hummus, cookies, dips, etc. (15 meals)

Each meal includes:
- Name, description, and Unsplash image
- Ingredients list
- Step-by-step instructions
- Category, preparation time, and difficulty

## Development Notes

- TypeScript strict mode enabled
- Path aliases configured (`@/*` → `./src/*`)
- ESLint configured for React and TypeScript
- Tailwind CSS 4 with custom teal primary color
- All contract files (types, services, utils, stores) are in place
- Ready for component development

## Next Steps

1. Set up Supabase project and database
2. Add environment variables
3. Implement authentication pages
4. Build core UI components
5. Implement meal generation logic
6. Add favorites and history features
7. Build admin panel
8. Test and deploy

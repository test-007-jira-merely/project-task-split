# MealGen - Intelligent Meal Discovery Platform

Production-grade, enterprise-level meal discovery SaaS application built with modern web technologies.

## Tech Stack

- **Frontend Framework**: React 18 + Vite
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom theme system
- **Animation**: Framer Motion
- **State Management**: Zustand with persistence
- **Backend**: Supabase (Auth + PostgreSQL)
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod validation
- **Data Fetching**: TanStack Query
- **Icons**: Lucide React

## Features

- 🍽️ Smart meal discovery based on available ingredients
- 🔍 Advanced filtering by category, difficulty, and prep time
- ❤️ Favorites management
- 📜 Meal generation history
- 🌙 Dark mode support with system preference detection
- 👤 User authentication with Supabase
- 📊 100+ curated meal recipes
- 🎨 Glassmorphism UI design
- ⚡ Fast and responsive

## Project Structure

```
src/
├── app/               # App layout, providers, router
├── components/        # Reusable UI components
│   ├── ui/           # Base UI components
│   ├── layout/       # Layout components
│   ├── meal/         # Meal-specific components
│   ├── ingredients/  # Ingredient components
│   └── admin/        # Admin components
├── pages/            # Page components
│   ├── home/         # Home page
│   ├── ingredients/  # Ingredient filter page
│   ├── favorites/    # Favorites page
│   ├── history/      # History page
│   ├── admin/        # Admin dashboard
│   └── auth/         # Authentication pages
├── features/         # Feature modules
│   ├── meal-generator/
│   ├── ingredient-filter/
│   ├── favorites/
│   └── history/
├── stores/           # Zustand state management
├── services/         # API services
│   ├── supabase.ts
│   ├── supabaseAuth.ts
│   ├── supabaseData.ts
│   └── mealService.ts
├── utils/            # Utility functions
│   └── ingredientUtils.ts
├── data/             # Static data
│   └── meals.json    # 100+ meal dataset
├── hooks/            # Custom React hooks
│   └── useTheme.ts
├── types/            # TypeScript types
│   ├── meal.ts
│   ├── user.ts
│   └── supabase.ts
└── styles/           # Global styles
    └── globals.css
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Add your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set Up Supabase Database

1. Create a new project on [Supabase](https://supabase.com)
2. Go to the SQL Editor
3. Execute the SQL schema from `SUPABASE_SCHEMA.sql`

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Meal Dataset

The application includes 107 pre-defined meals:
- **30 Breakfast recipes** (pancakes, smoothies, omelettes, etc.)
- **30 Lunch recipes** (salads, sandwiches, wraps, etc.)
- **30 Dinner recipes** (pasta, stir-fry, grilled meats, etc.)
- **17 Snack recipes** (dips, energy balls, fruit bowls, etc.)

Each meal includes:
- Name and description
- High-quality image URL
- Complete ingredient list
- Step-by-step instructions
- Category classification
- Preparation time
- Difficulty level

## State Management

The application uses Zustand for global state with localStorage persistence:
- User authentication state
- Theme preferences (light/dark)
- Selected ingredients
- Favorites list
- Generation history
- Applied filters

## Theme System

Custom theme system with:
- Light and dark mode
- Automatic OS preference detection
- CSS custom properties for consistent styling
- Smooth transitions between themes
- Persistent theme selection

## API Services

### Meal Service
- Get all meals
- Generate random meal
- Find meals by ingredients
- Filter and sort meals
- Ingredient matching algorithm

### Supabase Auth Service
- User sign up
- User sign in
- Sign out
- Get current user
- Auth state change listener

### Supabase Data Service
- Manage favorites
- Track generation history
- CRUD operations for meals
- Bulk import meals

## Development

This project uses:
- **Strict TypeScript** for type safety
- **Path aliases** (@/* for src/)
- **ESLint** for code quality
- **Vite** for fast development and builds

## License

MIT

## Contributing

Contributions are welcome! Please read the contributing guidelines before submitting PRs.

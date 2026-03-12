# MealGen - Development Guide

## Commands

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Architecture

### State Management
- Zustand for global state
- TanStack Query for server state
- Local storage for theme and preferences

### Routing
- React Router with lazy-loaded pages
- Protected routes for authenticated features
- Admin route protection

### Styling
- Tailwind CSS with custom theme
- CSS variables for theme system
- Framer Motion for animations

### Data Flow
- Local meals.json as primary dataset
- Supabase for user data (favorites, history)
- Admin can import meals to Supabase

### Folder Structure
```
src/
├── app/                    # App initialization and providers
├── components/
│   ├── ui/                # Reusable UI components
│   ├── meal/              # Meal-specific components
│   ├── ingredients/       # Ingredient-related components
│   ├── admin/             # Admin-only components
│   └── layout/            # Layout components
├── pages/                 # Page components
│   ├── home/
│   ├── ingredients/
│   ├── favorites/
│   ├── history/
│   ├── admin/
│   └── auth/
├── features/              # Feature-based modules
│   ├── meal-generator/
│   ├── ingredient-filter/
│   ├── favorites/
│   └── history/
├── stores/                # Zustand stores
├── services/              # API and external services
├── utils/                 # Utility functions
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript types
├── styles/                # Global styles and themes
└── data/                  # Static data (meals.json)
```

## Type System

All types are centralized in `src/types/`:
- `index.ts` - Domain types (Meal, User, etc.)
- `store.ts` - Zustand store interface

## Theme System

The app uses CSS variables for theming:
- Light/dark mode support
- Smooth transitions
- Persisted to localStorage
- System preference detection

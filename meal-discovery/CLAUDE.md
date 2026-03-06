# CLAUDE.md - MealGen Project Guide

This file provides guidance to Claude Code when working with the MealGen codebase.

## Build Commands

### Development
```bash
npm run dev
```
Starts Vite development server on http://localhost:5173

### Production Build
```bash
npm run build
npm run preview
```
Build TypeScript + Vite production bundle and preview it

### Type Checking
```bash
npx tsc --noEmit
```
Run TypeScript type checking without emitting files

### Linting
```bash
npm run lint
```
Run ESLint on the codebase

## Project Structure

```
src/
├── app/                    # Application setup (router, providers, layout)
├── components/             # Reusable UI components
│   ├── ui/                # Base UI components (buttons, cards, etc.)
│   ├── meal/              # Meal-specific components
│   ├── ingredients/       # Ingredient input and display
│   ├── admin/             # Admin dashboard components
│   └── layout/            # Layout components (navbar, sidebar)
├── pages/                 # Route-level page components
│   ├── home/              # Home page with meal generator
│   ├── ingredients/       # Ingredients-based meal search
│   ├── favorites/         # User favorites page
│   ├── history/           # Meal history page
│   ├── admin/             # Admin dashboard
│   └── auth/              # Authentication pages
├── features/              # Feature modules
│   ├── meal-generator/    # Random meal generation
│   ├── ingredient-filter/ # Ingredient-based filtering
│   ├── favorites/         # Favorites management
│   └── history/           # History tracking
├── stores/                # Zustand state management
├── services/              # External service integrations
│   ├── meal.service.ts    # Meal CRUD and filtering
│   ├── auth.service.ts    # Authentication
│   ├── favorites.service.ts
│   └── history.service.ts
├── utils/                 # Utility functions
│   ├── matching/          # Ingredient matching logic
│   └── normalization/     # String normalization
├── data/                  # Static data
│   └── meals.json         # 100+ meal dataset
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
└── styles/                # Global styles
    └── globals.css        # Tailwind + custom CSS
```

## Conventions

### TypeScript
- Strict mode enabled (`strict: true`)
- No unused locals or parameters
- Explicit return types preferred
- Path aliases: `@/*` maps to `src/*`

### React
- Use functional components with hooks
- Components use PascalCase naming
- Props interfaces defined in `component.props.ts`
- Custom hooks use `use` prefix

### Styling
- Tailwind CSS for all styling
- Custom theme colors in `tailwind.config.js`
- Dark mode via class strategy
- Framer Motion for animations

### State Management
- Zustand for global state
- TanStack Query for server state
- Local state with `useState` for component-specific data

### Data Flow
1. Services layer handles external APIs (Supabase)
2. Stores manage global application state
3. Components consume state via hooks
4. Utils provide pure transformation functions

## Configuration

### Environment Variables
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

### Key Files
- `vite.config.ts` - Vite bundler configuration
- `tailwind.config.js` - Tailwind CSS theme
- `tsconfig.app.json` - TypeScript compiler options
- `.env.local` - Local environment variables (not committed)

## Architecture Patterns

### Service Layer
All external API calls go through service interfaces:
- `IMealService` - Meal operations
- `IAuthService` - Authentication
- `IFavoritesService` - Favorites management
- `IHistoryService` - History tracking

### Type Safety
- Database types match Supabase schema
- All components have explicit prop types
- Contract interfaces ensure consistency

### Meal Matching Logic
- Ingredient normalization removes plurals, whitespace
- Fuzzy matching calculates match percentages
- Filters support category, difficulty, prep time

## Best Practices

1. Always import from `@/` path aliases
2. Export components from barrel files (`index.ts`)
3. Keep components focused and small
4. Use TypeScript for all files (no `.js` or `.jsx`)
5. Follow existing naming conventions
6. Test TypeScript compilation before committing

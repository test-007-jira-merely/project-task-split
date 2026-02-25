# MealFinder Frontend

React + Vite + TypeScript frontend for the Meal Discovery Platform with premium UI/UX, animations, and full state management.

## Features

- 🎨 **Premium UI/UX** - Apple/Linear/Vercel-inspired design
- 🌓 **Theme System** - Light/Dark/System modes with persistence
- 🎭 **Smooth Animations** - Framer Motion for all interactions
- 📦 **State Management** - Zustand stores for dishes, ingredients, UI
- 🔍 **Ingredient Matching** - Smart recipe discovery by ingredients
- ⚡ **Performance** - Code splitting, lazy loading, React Query caching
- ♿ **Accessible** - WCAG AA compliant, keyboard navigation
- 📱 **Responsive** - Mobile-first design

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling with CSS variables
- **Zustand** - State management
- **React Query** - Server state
- **Framer Motion** - Animations
- **Radix UI** - Accessible components
- **React Router** - Routing

## Getting Started

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file:

```
VITE_API_URL=http://localhost:3001/api
```

### Development

```bash
npm run dev
```

Runs on http://localhost:3000

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── layout/        # Layout components (Navbar, AppLayout)
│   ├── ui/            # UI primitives (Button, Card, Input)
│   ├── dish/          # Dish-related components
│   ├── ingredient/    # Ingredient matching components
│   ├── feedback/      # Empty states, errors, loading
│   └── animation/     # Animation wrappers
├── pages/             # Page components
├── stores/            # Zustand stores
├── hooks/             # Custom React hooks
├── lib/               # Utilities and API client
└── styles/            # Global CSS and theme
```

## Key Components

### State Management

- **dish-store.ts** - Current dish, history, favorites
- **ingredient-store.ts** - Selected ingredients, match results
- **ui-store.ts** - Theme, loading, errors, sidebar
- **animation-store.ts** - Animation coordination

### Pages

- **HomePage** - Hero, dish generation, ingredient matching
- **FavoritesPage** - Saved dishes grid
- **HistoryPage** - Recently viewed dishes

### Core Components

- **DishCard** - Dish display with 3D hover effects
- **IngredientEngine** - Tag-based ingredient input
- **MatchIndicator** - Score visualization with breakdown
- **ThemeToggle** - Light/Dark/System theme switcher

## API Integration

All API calls go through `src/lib/api-client.ts`:

- `getRandomDish()` - Generate random meal
- `matchIngredients()` - Find dishes by ingredients
- `getDishById()` - Fetch dish details
- `getIngredientSuggestions()` - Autocomplete

## Animations

Uses Framer Motion for:
- Page transitions
- Card hover effects (3D tilt)
- Loading states
- Ingredient tag animations
- Score progress bars
- Micro-interactions (button press, etc.)

Respects `prefers-reduced-motion` for accessibility.

## Theme System

CSS variable-based theming with 3 modes:
- **Light** - Bright, clean interface
- **Dark** - Low-light friendly
- **System** - Syncs with OS preference

Theme persists to localStorage and updates on OS changes.

## Testing

```bash
# Unit tests
npm test

# UI tests
npm run test:ui
```

## Performance

- Code splitting via dynamic imports
- React Query for intelligent caching
- Image lazy loading
- Debounced search inputs
- Memoized expensive computations

## Accessibility

- Semantic HTML
- ARIA labels and roles
- Keyboard navigation
- Focus management
- Screen reader support
- Color contrast compliance

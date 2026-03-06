# MealGen - Random Meal Generator

A modern, production-ready web application for discovering meal ideas and finding recipes based on available ingredients.

## Features

- **Random Meal Generator**: Discover new meals with a single click
- **Ingredient-Based Filtering**: Find recipes using ingredients you already have
- **Match Percentage System**: See how well meals match your available ingredients
- **Dark/Light Theme**: Fully responsive theme system with OS preference detection
- **Favorites Management**: Save and organize your favorite recipes
- **Modern UI/UX**: Clean, responsive design with smooth animations
- **52+ Meal Database**: Diverse collection of breakfast, lunch, dinner, and snack recipes

## Technology Stack

- **React 18.3** - UI framework
- **TypeScript** - Type-safe development
- **Vite 5** - Fast build tool and dev server
- **Tailwind CSS 3.4** - Utility-first styling
- **Framer Motion 11** - Animation library
- **Zustand 4.5** - State management with persistence

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn

### Installation

1. Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

### Linting

Run ESLint:

```bash
npm run lint
```

## Project Structure

```
src/
├── components/          # React components
│   ├── AppLayout.tsx
│   ├── DishCard.tsx
│   ├── EmptyState.tsx
│   ├── IngredientInput.tsx
│   ├── IngredientTag.tsx
│   ├── LoadingState.tsx
│   ├── MatchIndicator.tsx
│   ├── Navbar.tsx
│   └── ThemeToggle.tsx
├── data/               # Static data
│   └── meals.json
├── store/              # Zustand state management
│   └── useMealStore.ts
├── types/              # TypeScript type definitions
│   └── meal.ts
├── utils/              # Utility functions
│   └── matching.ts
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

## Key Features Implementation

### State Management

Uses Zustand with persistence middleware to maintain:
- Current displayed meal
- User's ingredient list
- Filtered meal results
- Favorite meals
- Theme preference

### Matching Algorithm

The ingredient matching system:
- Normalizes strings (case-insensitive)
- Removes duplicates
- Calculates match percentage
- Sorts by best match
- Supports partial ingredient matching

### Theme System

- CSS variables for consistent theming
- Tailwind dark mode with class strategy
- Persists preference in localStorage
- Respects OS theme preference
- Smooth 300ms transitions

### Performance Optimizations

- Lazy image loading with loading states
- Framer Motion layout animations
- Memoized calculations
- Efficient state updates

## Component Architecture

### Core Components

- **AppLayout**: Main layout wrapper
- **Navbar**: Navigation with theme toggle
- **DishCard**: Displays meal details with animations
- **IngredientInput**: Tag-based ingredient input
- **MatchIndicator**: Visual match percentage display

### State Components

- **EmptyState**: Placeholder for empty data
- **LoadingState**: Loading spinner with animation

## Data Model

```typescript
interface Meal {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}
```

## Contributing

This is a production-ready application. Feel free to extend the meal database or add new features.

## License

MIT

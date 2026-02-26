# MealMaster Frontend

React + Vite frontend application with TypeScript, Tailwind CSS, and Framer Motion animations.

## Features

- ⚡️ **Vite** - Lightning fast development server
- ⚛️ **React 18** - Latest React features
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🌗 **Dark/Light Theme** - Smooth theme transitions with localStorage persistence
- ✨ **Framer Motion** - Beautiful animations and transitions
- 📦 **TypeScript** - Type-safe code with strict mode
- 🎯 **Path Aliases** - Clean imports with `@/` prefix
- 🧩 **Component Library** - Reusable UI components
- 📱 **Responsive Design** - Mobile-first approach

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Type check
pnpm type-check

# Lint
pnpm lint
```

## Project Structure

```
src/
├── components/
│   ├── layout/          # Layout components (Navbar, Footer, AppLayout)
│   ├── theme/           # Theme toggle component
│   ├── dish/            # Dish-related components (DishCard, DishDetails)
│   ├── ingredients/     # Ingredient engine and tags
│   ├── matching/        # Match indicators and result cards
│   ├── favorites/       # Favorites button and list
│   ├── history/         # History timeline
│   ├── ui/              # Reusable UI components
│   └── hero/            # Hero section
├── pages/               # Page components
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── assets/              # Static assets
├── App.tsx              # Root app component
├── main.tsx             # Entry point
└── index.css            # Global styles and Tailwind
```

## Theme System

The app supports light and dark themes with:
- CSS variables for colors
- localStorage persistence
- System preference detection
- Smooth transitions

Toggle the theme using the button in the navbar.

## Component Examples

### DishCard
```tsx
<DishCard dish={dish} onViewDetails={() => {}} />
```

### IngredientEngine
```tsx
<IngredientEngine
  ingredients={ingredients}
  onAdd={(ingredient) => {}}
  onRemove={(ingredient) => {}}
  onSearch={() => {}}
/>
```

### HeroSection
```tsx
<HeroSection
  onGenerateMeal={() => {}}
  isLoading={false}
/>
```

## Styling

- **Tailwind CSS** for utility classes
- **CSS Variables** for theme colors
- **Framer Motion** for animations
- **Custom Components** with consistent styling

## Next Steps

This is the foundation layer. The next subtask will:
1. Connect components to backend APIs
2. Implement state management with Zustand
3. Add data fetching and caching
4. Complete all page functionality

## Tech Stack

- React 18.2
- Vite 5.0
- TypeScript 5.3
- Tailwind CSS 3.4
- Framer Motion 10.18
- React Router 6.21
- Lucide React (icons)
- Radix UI (headless components)

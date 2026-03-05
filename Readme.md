# MealGen - Discover Your Next Meal

A modern, production-ready meal generator web application that helps you discover delicious recipes based on random generation or your available ingredients.

## Features

- **🎲 Random Meal Generator**: Discover new recipes with a single click
- **🥘 Ingredient-Based Filtering**: Find meals you can make with what you have
- **⭐ Favorites Management**: Save your favorite recipes for quick access
- **🌓 Dark/Light Theme**: Automatic theme detection with manual toggle
- **📱 Fully Responsive**: Optimized for mobile, tablet, and desktop
- **⚡ Fast & Modern**: Built with React, TypeScript, and Vite
- **🎨 Beautiful UI**: Smooth animations and modern design

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

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
├── components/      # React components
├── store/          # Zustand state management
├── data/           # Meal dataset (53 recipes)
├── types/          # TypeScript definitions
├── utils/          # Utility functions
└── styles/         # Global styles
```

## Features in Detail

### Random Meal Generation
- Generates random meals from a curated dataset of 53+ recipes
- Prevents consecutive repeats for better variety
- Smooth loading animations

### Ingredient-Based Filtering
- Add ingredients you have available
- Smart matching algorithm calculates match percentage
- Shows full matches (100%) and partial matches
- Browse all available meals sorted by match percentage

### Favorites
- Save your favorite meals with one click
- Persisted to localStorage
- Quick access via Favorites tab

### Theme System
- Automatic OS preference detection
- Manual dark/light mode toggle
- Smooth transitions between themes
- Preference saved to localStorage

## Dataset

The application includes 53 diverse recipes across categories:
- Breakfast
- Lunch
- Dinner
- Snacks

Each recipe includes:
- High-quality image
- Description
- Full ingredient list
- Step-by-step instructions
- Category classification

## License

MIT

# Meal Platform Frontend

React + TypeScript + Vite frontend application with state management, API integration, and modern UI.

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom theming
- **Animations**: Framer Motion
- **State Management**: Zustand with persist middleware
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Environment Variables

Create `.env.local`:

```env
VITE_API_URL=http://localhost:3000/api
```

## Features

- Random meal generation with history tracking
- Ingredient-based recipe matching with substitutions
- Favorites management with persistence
- Dark/light theme with system preference detection
- Responsive design for all devices
- Smooth animations with Framer Motion
- Error boundaries and loading states

For more details, see `/SUBTASK_2_COMPLETE.md`

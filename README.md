# MealGen - Intelligent Meal Discovery Platform

A modern, production-grade meal discovery application built with React, TypeScript, and Supabase.

## 🚀 Quick Start

```bash
cd meal-discovery
npm install
npm run dev
```

Visit http://localhost:5173 to see the app.

## 📁 Project Structure

The main application is in the `meal-discovery/` directory:

```
meal-discovery/
├── src/                    # Application source code
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── features/         # Feature modules
│   ├── stores/           # Zustand state management
│   ├── services/         # Supabase services
│   ├── utils/            # Utility functions
│   ├── data/             # meals.json (102 meals)
│   └── types/            # TypeScript definitions
├── README.md             # Detailed documentation
└── CLAUDE.md             # Architecture guide
```

## ✨ Features

- 🎲 Random meal generation
- 🥗 Ingredient-based meal search
- ❤️ Favorites system
- 📜 Meal history tracking
- 🔐 User authentication
- 🌓 Dark/light theme
- 👨‍💼 Admin dashboard
- 📱 Fully responsive design

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Framer Motion
- **State Management**: Zustand + TanStack Query
- **Backend**: Supabase
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod

## 📊 Dataset

The application includes a comprehensive meals dataset:
- **102 total meals**
- 25 breakfast recipes
- 30 lunch recipes
- 30 dinner recipes
- 17 snack recipes

Each meal includes:
- High-quality images from Unsplash
- Complete ingredient lists
- Step-by-step instructions
- Difficulty level and prep time
- Category classification

## 🔧 Development

For detailed development instructions, architecture documentation, and conventions, see:
- `meal-discovery/README.md` - Setup and Supabase configuration
- `meal-discovery/CLAUDE.md` - Architecture and best practices

## 📝 License

MIT

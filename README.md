# Meal Generator Application

A modern, full-stack meal discovery platform built with React, TypeScript, and Supabase.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Add your Supabase credentials to .env

# Start development server
npm run dev

# Build for production
npm run build
```

## 📦 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with dark mode support
- **State Management**: Zustand
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 🗂️ Project Structure

```
src/
├── app/                    # App-level components
├── components/             # Reusable components (UI, meal, ingredients, admin, layout)
├── pages/                  # Page components (home, ingredients, favorites, history, admin, auth)
├── features/               # Feature modules (meal-generator, ingredient-filter, favorites, history)
├── stores/                 # Zustand state stores
├── services/               # API and data services
├── utils/                  # Utility functions
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript type definitions
└── data/                   # Static data (105 meals)
```

## 🎯 Features

- **Smart Meal Generation**: Get meal suggestions based on available ingredients
- **Ingredient Matching**: Advanced algorithm to match recipes with your pantry
- **User Favorites**: Save your favorite meals
- **Generation History**: Track previously generated meals
- **Dark Mode**: System-aware theme switching
- **Admin Panel**: Manage meals database (admin users only)
- **Authentication**: Secure user authentication via Supabase
- **Responsive Design**: Works on desktop, tablet, and mobile

## 📊 Database Setup

The application uses Supabase for backend services. To set up the database:

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
3. Copy your project URL and anon key to `.env`

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📝 Data

The application includes 105 pre-loaded meals:
- 22 breakfast recipes
- 24 lunch recipes
- 39 dinner recipes
- 20 snack recipes

Each meal includes:
- Name and description
- Ingredients list
- Step-by-step instructions
- Category and difficulty level
- Preparation time
- High-quality image

## 🔐 Environment Variables

Create a `.env` file with:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🛠️ Development

This project uses:
- TypeScript strict mode for type safety
- ESLint for code quality
- Path aliases (`@/*`) for clean imports
- Tailwind CSS for utility-first styling

## 📄 License

MIT

# MealGen - Intelligent Meal Discovery Platform

A production-grade meal discovery SaaS application built with React, TypeScript, and Supabase.

## Features

✨ **Random Meal Generator** - Instantly discover new meals with one click
🔍 **Ingredient-based Filtering** - Find meals based on available ingredients
❤️ **Favorites System** - Save and manage your favorite meals
📜 **Meal History** - Track recently generated meals
🎨 **Dark/Light Theme** - Beautiful UI with theme switching
📱 **Fully Responsive** - Works perfectly on all devices
🛡️ **Admin Dashboard** - Manage meals and import datasets
🔐 **User Authentication** - Secure login with Supabase

## Tech Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS + Framer Motion
- **State Management**: Zustand
- **Backend**: Supabase (Auth + Database)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **Data Fetching**: TanStack Query
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Create the following tables in Supabase SQL editor:

   ```sql
   -- Users table (automatically created by Supabase Auth)

   -- Meals table
   CREATE TABLE meals (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     description TEXT NOT NULL,
     image_url TEXT NOT NULL,
     ingredients TEXT[] NOT NULL,
     instructions TEXT[] NOT NULL,
     category TEXT NOT NULL,
     prep_time INTEGER,
     difficulty TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Favorites table
   CREATE TABLE favorites (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     meal_id UUID REFERENCES meals(id) ON DELETE CASCADE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     UNIQUE(user_id, meal_id)
   );

   -- User history table
   CREATE TABLE user_history (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     meal_id UUID REFERENCES meals(id) ON DELETE CASCADE,
     generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

4. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_ADMIN_EMAILS=admin@example.com
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173)

## Usage

### For Users

1. **Sign Up**: Create an account to access all features
2. **Generate Meals**: Click "Generate Random Meal" on the home page
3. **Filter by Ingredients**: Go to the Ingredients page and add available ingredients
4. **Save Favorites**: Click the heart icon on any meal card
5. **View History**: Check your recently generated meals

### For Admins

1. Add your email to `VITE_ADMIN_EMAILS` in `.env`
2. Access the Admin Dashboard at `/admin`
3. Import the local dataset with one click
4. Create, edit, or delete meals
5. Manage the meal database

## Project Structure

```
src/
├── app/              # App configuration, providers, router
├── components/       # Reusable UI components
│   ├── ui/          # Base UI primitives
│   ├── meal/        # Meal-specific components
│   ├── ingredients/ # Ingredient components
│   ├── admin/       # Admin components
│   └── layout/      # Layout components
├── pages/           # Page components
├── stores/          # Zustand state management
├── services/        # API services
├── utils/           # Utility functions
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
├── styles/          # Global styles and themes
└── data/            # Local meal dataset
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

MIT

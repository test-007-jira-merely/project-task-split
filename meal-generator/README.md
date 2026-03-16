# MealGen - AI-Style Meal Discovery Platform

A modern, production-grade web application for discovering and managing meals with intelligent ingredient-based filtering.

## Features

- 🎲 Random meal generation
- 🔍 Intelligent ingredient-based meal finder
- ❤️ User favorites system
- 📜 Meal history tracking
- 🔐 User authentication with Supabase
- 🎨 Dark/Light theme support
- 📱 Fully responsive design
- ⚡ Production-ready performance optimizations
- ♿ Full accessibility compliance
- 🛡️ Admin panel for meal management

## Tech Stack

- **React 18** + **Vite** - Fast, modern build tooling
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Zustand** - Global state management
- **TanStack Query** - Server state management
- **React Hook Form + Zod** - Form validation
- **Supabase** - Authentication and database
- **React Router** - Client-side routing

## Setup Instructions

### 1. Clone and Install

```bash
git clone <repository-url>
cd meal-generator
npm install
```

### 2. Configure Supabase

1. Create a Supabase project at https://supabase.com
2. Create the following tables in your Supabase database:

**meals table:**
```sql
create table meals (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  imageUrl text not null,
  description text not null,
  ingredients text[] not null,
  instructions text[] not null,
  category text not null check (category in ('breakfast', 'lunch', 'dinner', 'snack')),
  difficulty text check (difficulty in ('easy', 'medium', 'hard')),
  prepTime integer,
  created_at timestamp with time zone default now()
);
```

**favorites table:**
```sql
create table favorites (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  meal_id uuid references meals not null,
  created_at timestamp with time zone default now(),
  unique(user_id, meal_id)
);
```

**user_history table:**
```sql
create table user_history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  meal_id uuid references meals not null,
  generated_at timestamp with time zone default now()
);
```

3. Enable Row Level Security (RLS) policies as needed

### 3. Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values.

### 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:5173

### 5. Build for Production

```bash
npm run build
npm run preview
```

## Usage

### For Users
- **Home**: Generate random meals
- **Ingredients**: Find meals by available ingredients
- **Favorites**: Save and view favorite meals (requires login)
- **History**: View recently generated meals (requires login)

### For Admins
- Access `/admin` route (must be configured in VITE_ADMIN_EMAILS)
- Create, edit, and delete meals
- Import meal datasets via JSON
- View meal statistics

## Project Structure

```
meal-generator/
├── src/
│   ├── app/                 # App configuration
│   │   ├── providers.tsx    # Global providers
│   │   └── router.tsx       # Route definitions
│   ├── components/          # Reusable components
│   │   ├── admin/           # Admin-specific components
│   │   ├── ingredients/     # Ingredient filter components
│   │   ├── layout/          # Layout components
│   │   ├── meal/            # Meal display components
│   │   └── ui/              # Base UI components
│   ├── features/            # Feature-specific code
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components
│   ├── services/            # API services
│   ├── stores/              # Zustand stores
│   ├── types/               # TypeScript types
│   └── utils/               # Utility functions
├── public/                  # Static assets
└── index.html              # Entry HTML
```

## License

MIT

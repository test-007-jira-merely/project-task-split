# MealGen - Intelligent Meal Discovery Platform

A modern, production-grade meal discovery web application built with React, TypeScript, and Supabase.

## Features

- 🎲 Random meal generator
- 🔍 Ingredient-based meal filtering
- ❤️ Favorites system
- 📜 Meal history tracking
- 🔐 User authentication
- 👨‍💼 Admin dashboard
- 🌓 Dark/Light theme
- 📱 Fully responsive

## Tech Stack

- React 18 + Vite
- TypeScript (strict mode)
- Tailwind CSS
- Framer Motion
- Zustand
- Supabase
- React Router
- React Hook Form + Zod
- TanStack Query
- Lucide Icons

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Supabase

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Setup Supabase Database

Create the following tables in your Supabase project:

**meals**
```sql
create table meals (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text not null,
  image_url text not null,
  ingredients text[] not null,
  instructions text[] not null,
  category text not null check (category in ('breakfast', 'lunch', 'dinner', 'snack')),
  difficulty text check (difficulty in ('easy', 'medium', 'hard')),
  prep_time integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

**favorites**
```sql
create table favorites (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  meal_id uuid references meals not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, meal_id)
);
```

**user_history**
```sql
create table user_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  meal_id uuid references meals not null,
  generated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### 4. Enable Row Level Security (RLS)

```sql
-- Meals: Public read, authenticated write
alter table meals enable row level security;

create policy "Meals are viewable by everyone"
  on meals for select
  using (true);

create policy "Authenticated users can insert meals"
  on meals for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can update meals"
  on meals for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete meals"
  on meals for delete
  using (auth.role() = 'authenticated');

-- Favorites: Users can only manage their own
alter table favorites enable row level security;

create policy "Users can view own favorites"
  on favorites for select
  using (auth.uid() = user_id);

create policy "Users can insert own favorites"
  on favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own favorites"
  on favorites for delete
  using (auth.uid() = user_id);

-- History: Users can only manage their own
alter table user_history enable row level security;

create policy "Users can view own history"
  on user_history for select
  using (auth.uid() = user_id);

create policy "Users can insert own history"
  on user_history for insert
  with check (auth.uid() = user_id);
```

### 5. Run development server

```bash
npm run dev
```

## Admin Panel

Access the admin panel at `/admin` (requires authentication).

### Import Sample Dataset

Use the `public/sample-meals.json` file for quick import via the admin dashboard's "Import JSON" button.

## Project Structure

```
src/
├── app/              # App configuration (router, providers)
├── components/       # Reusable components
│   ├── ui/          # Base UI components
│   ├── layout/      # Layout components
│   ├── meal/        # Meal-related components
│   ├── ingredients/ # Ingredient components
│   └── admin/       # Admin components
├── pages/           # Page components
├── hooks/           # Custom React hooks
├── services/        # API services
├── stores/          # Zustand stores
├── types/           # TypeScript types
└── utils/           # Utility functions
```

## License

MIT

# MealGen Setup Guide

## Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)

## Supabase Setup

### 1. Create a Supabase Project

1. Go to https://supabase.com and create a new project
2. Wait for the project to finish setting up

### 2. Create Database Tables

Run these SQL commands in Supabase SQL Editor:

```sql
-- Users table (handled by Supabase Auth, but you can extend it)
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Meals table
create table public.meals (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text not null,
  image_url text not null,
  ingredients text[] not null,
  instructions text[] not null,
  category text not null check (category in ('breakfast', 'lunch', 'dinner', 'snack')),
  preparation_time integer,
  difficulty text check (difficulty in ('easy', 'medium', 'hard')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Favorites table
create table public.favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  meal_id uuid references public.meals on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, meal_id)
);

-- User History table
create table public.user_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  meal_id uuid references public.meals on delete cascade not null,
  generated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.meals enable row level security;
alter table public.favorites enable row level security;
alter table public.user_history enable row level security;

-- Policies for meals (public read, authenticated write)
create policy "Meals are viewable by everyone"
  on public.meals for select
  using (true);

create policy "Meals are insertable by authenticated users"
  on public.meals for insert
  with check (auth.role() = 'authenticated');

create policy "Meals are updatable by authenticated users"
  on public.meals for update
  using (auth.role() = 'authenticated');

create policy "Meals are deletable by authenticated users"
  on public.meals for delete
  using (auth.role() = 'authenticated');

-- Policies for favorites
create policy "Users can view their own favorites"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "Users can insert their own favorites"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own favorites"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- Policies for history
create policy "Users can view their own history"
  on public.user_history for select
  using (auth.uid() = user_id);

create policy "Users can insert their own history"
  on public.user_history for insert
  with check (auth.uid() = user_id);
```

### 3. Get Supabase Credentials

1. Go to Project Settings → API
2. Copy the Project URL and anon/public key

## Application Setup

### 1. Install Dependencies

```bash
cd meal-generator
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ADMIN_EMAILS=admin@example.com,another-admin@example.com
```

### 3. Import Sample Data

1. Run the development server: `npm run dev`
2. Create an account and login
3. Add your email to `VITE_ADMIN_EMAILS` in `.env`
4. Restart the dev server
5. Navigate to `/admin`
6. Click "Import" button
7. Copy the contents of `sample-meals.json` and paste into the import dialog
8. Click "Import"

## Running the Application

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## Features Overview

### For All Users
- **Home**: Generate random meals
- **Ingredients**: Find meals by available ingredients
- Browse meals with beautiful UI

### For Authenticated Users
- **Favorites**: Save and manage favorite meals
- **History**: Track generated meals

### For Admins
- **Admin Panel**: Full CRUD operations for meals
- **Import**: Bulk import meals via JSON
- Manage complete meal database

## Technology Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Forms**: React Hook Form + Zod
- **Backend**: Supabase (Auth + PostgreSQL)
- **Routing**: React Router v6

## Project Structure

```
src/
├── app/                 # App configuration
├── components/          # Reusable components
│   ├── ui/             # Base UI components
│   ├── layout/         # Layout components
│   ├── meal/           # Meal-specific components
│   ├── ingredients/    # Ingredient components
│   └── admin/          # Admin components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── stores/             # Zustand stores
├── services/           # API services
├── utils/              # Utility functions
├── types/              # TypeScript types
└── styles/             # Global styles
```

## Troubleshooting

### Environment Variables Not Loading
- Ensure `.env` file is in the project root
- Restart the dev server after changing `.env`
- Variables must start with `VITE_`

### Supabase Connection Issues
- Verify Project URL and anon key are correct
- Check if Supabase project is active
- Ensure RLS policies are correctly set up

### Admin Access Issues
- Confirm email in `VITE_ADMIN_EMAILS` matches your account email
- Restart dev server after updating admin emails
- Check for typos in email addresses

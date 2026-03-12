-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text not null unique,
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Meals table
create table public.meals (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text not null,
  image_url text not null,
  ingredients text[] not null,
  instructions text[] not null,
  category text not null check (category in ('breakfast', 'lunch', 'dinner', 'snack')),
  difficulty text check (difficulty in ('easy', 'medium', 'hard')),
  prep_time integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Favorites table
create table public.favorites (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  meal_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, meal_id)
);

-- User history table
create table public.user_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  meal_id text not null,
  generated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.meals enable row level security;
alter table public.favorites enable row level security;
alter table public.user_history enable row level security;

-- Policies for users
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- Policies for meals
create policy "Anyone can view meals"
  on public.meals for select
  using (true);

create policy "Admins can insert meals"
  on public.meals for insert
  with check (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.is_admin = true
    )
  );

create policy "Admins can update meals"
  on public.meals for update
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.is_admin = true
    )
  );

create policy "Admins can delete meals"
  on public.meals for delete
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.is_admin = true
    )
  );

-- Policies for favorites
create policy "Users can view own favorites"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "Users can insert own favorites"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own favorites"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- Policies for history
create policy "Users can view own history"
  on public.user_history for select
  using (auth.uid() = user_id);

create policy "Users can insert own history"
  on public.user_history for insert
  with check (auth.uid() = user_id);

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

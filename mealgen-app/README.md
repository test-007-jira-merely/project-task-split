# MealGen - Intelligent Meal Discovery Platform

A modern web application that helps users discover meals based on available ingredients, save favorites, and track meal history. Built with React, TypeScript, and Supabase.

![MealGen Screenshot](https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=400&fit=crop)

## ✨ Features

### For Users
- 🎲 **Random Meal Generation** - Get meal suggestions with intelligent history tracking
- 🔍 **Ingredient-Based Filtering** - Find meals based on ingredients you have
- 📊 **Match Percentage** - See how well each meal matches your available ingredients
- ❤️ **Favorites System** - Save and organize your favorite meals
- 📜 **History Tracking** - Keep track of previously generated meals
- 🌓 **Dark Mode** - Seamless light/dark theme switching
- 📱 **Responsive Design** - Works beautifully on all devices

### For Admins
- ➕ **CRUD Operations** - Create, read, update, and delete meals
- 📤 **Bulk Import** - Import meals from JSON files
- 📈 **Dashboard Stats** - View user engagement and meal statistics
- 🔒 **Role-Based Access** - Secure admin-only features
- 🔎 **Search & Filter** - Advanced meal management with pagination

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Zustand** - Lightweight state management
- **TanStack Query** - Powerful data fetching and caching
- **React Router** - Client-side routing
- **React Hook Form** - Performant form validation
- **Zod** - TypeScript-first schema validation
- **Lucide React** - Beautiful icon library

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication (email/password)
  - Row Level Security (RLS)
  - Real-time subscriptions

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier available)

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mealgen-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL schema from `CLAUDE.md` in the SQL Editor
   - Enable Email Auth in Authentication settings

4. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local`:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173)

## 🗄️ Database Setup

Run this SQL in your Supabase SQL Editor:

```sql
-- Users table
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_admin BOOLEAN DEFAULT FALSE
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Meals table
CREATE TABLE public.meals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  ingredients TEXT[] NOT NULL,
  instructions TEXT[] NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('breakfast', 'lunch', 'dinner', 'snack')),
  preparation_time INTEGER,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Meals are viewable by everyone" ON public.meals FOR SELECT USING (true);
CREATE POLICY "Admins can insert meals" ON public.meals FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can update meals" ON public.meals FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can delete meals" ON public.meals FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
);

-- Favorites table
CREATE TABLE public.favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  meal_id UUID REFERENCES public.meals(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, meal_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own favorites" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- User history table
CREATE TABLE public.user_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  meal_id UUID REFERENCES public.meals(id) ON DELETE CASCADE NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.user_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own history" ON public.user_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own history" ON public.user_history FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Make a User an Admin

```sql
UPDATE public.users SET is_admin = true WHERE email = 'your-email@example.com';
```

## 📂 Project Structure

```
src/
├── app/                    # App configuration
│   ├── router.tsx         # Route definitions
│   └── providers.tsx      # Context providers
├── components/
│   ├── admin/             # Admin panel components
│   ├── ingredients/       # Ingredient input/tags
│   ├── layout/            # Layout components
│   ├── meal/              # Meal cards and details
│   └── ui/                # Reusable UI components
├── features/              # Feature hooks
├── hooks/                 # Custom React hooks
├── pages/                 # Page components
├── services/              # API services
├── stores/                # Zustand state stores
├── types/                 # TypeScript definitions
├── utils/                 # Utility functions
└── styles/                # Global styles
```

## 🎯 Usage

### For Users

1. **Sign up** - Create an account with email/password
2. **Add ingredients** - Enter ingredients you have available
3. **Generate meals** - Click "Generate Random Meal" to discover recipes
4. **View matches** - See how well each meal matches your ingredients
5. **Save favorites** - Click the heart icon to save meals
6. **Track history** - View your previously generated meals

### For Admins

1. **Access admin panel** - Navigate to `/admin` (requires admin role)
2. **Manage meals** - Create, edit, or delete meals
3. **Import data** - Bulk import meals from JSON files
4. **View statistics** - Monitor user engagement

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- **TypeScript strict mode** enabled
- **ESLint** for code quality
- **Prettier** (recommended) for formatting
- Follow React best practices and hooks guidelines

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

### Netlify

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Add environment variables
4. Deploy

### Manual Deployment

```bash
npm run build
# Upload the `dist` folder to your hosting provider
```

## 🔒 Security

- **Row Level Security (RLS)** enabled on all tables
- **JWT authentication** via Supabase
- **Admin-only routes** protected
- **Input validation** with Zod schemas
- **XSS prevention** via React's built-in escaping

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Images from [Unsplash](https://unsplash.com)
- Icons from [Lucide](https://lucide.dev)
- UI inspiration from modern design systems

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using React and Supabase

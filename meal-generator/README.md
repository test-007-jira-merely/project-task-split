# MealGen - Intelligent Meal Discovery Platform

A modern, production-grade web application for discovering and managing meals with ingredient-based filtering, built with React, TypeScript, and Supabase.

## Features

- 🎲 **Random meal generation** - Discover new meals with a single click
- 🔍 **Ingredient-based filtering** - Find meals based on ingredients you have
- ❤️ **Favorites system** - Save your favorite meals for quick access
- 📜 **Meal history tracking** - Keep track of previously generated meals
- 👤 **User authentication** - Secure sign-up and login with Supabase
- 🛠️ **Admin panel** - Complete CMS for meal management with CRUD operations
- 📥 **Dataset import** - Import meal collections via JSON files
- 🌓 **Dark/Light theme** - Automatic theme switching with system preference support
- 📱 **Fully responsive** - Optimized for desktop, tablet, and mobile devices
- ♿ **Accessible** - Keyboard navigation and screen reader support

## Tech Stack

- **Frontend:** React 19 + TypeScript (strict mode)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 4.x with custom theme system
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Backend:** Supabase (PostgreSQL + Auth)
- **Data Fetching:** TanStack Query (React Query)
- **Forms:** React Hook Form + Zod validation
- **Routing:** React Router DOM
- **Icons:** Lucide React

## Setup

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd meal-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Project Settings > API to get your credentials
   - Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Run database migrations**
   - Open your Supabase project's SQL Editor
   - Run the SQL from `supabase-schema.sql` to create tables and policies

5. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## Usage

### Regular Users

1. **Sign up** - Create an account at `/signup`
2. **Generate meals** - Click the generate button on the home page
3. **Filter by ingredients** - Go to Ingredients page, add ingredients you have
4. **Save favorites** - Click the heart icon on any meal card
5. **View history** - Check your meal generation history

### Admin Users

1. **Access admin panel** - Navigate to `/admin` (requires admin privileges)
2. **Manage meals** - Create, edit, or delete meals
3. **Import datasets** - Upload JSON files with meal collections

### Making a User Admin

Run this SQL in your Supabase SQL Editor:

```sql
UPDATE public.users
SET is_admin = true
WHERE email = 'your@email.com';
```

### Importing Sample Data

1. Log in as an admin user
2. Navigate to Admin Panel (`/admin`)
3. Click "Import Dataset"
4. Upload the `sample-data.json` file
5. The system will import meals and skip duplicates

## Project Structure

```
meal-generator/
├── src/
│   ├── app/              # App configuration and providers
│   ├── components/       # React components
│   │   ├── admin/        # Admin panel components
│   │   ├── layout/       # Layout components
│   │   └── ui/           # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── services/         # API services and Supabase client
│   ├── stores/           # Zustand state management
│   ├── styles/           # Global styles and Tailwind config
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── sample-data.json      # Sample meal dataset
├── supabase-schema.sql   # Database schema
└── README.md
```

## Build for Production

```bash
# Build the app
npm run build

# Preview production build
npm run preview
```

The built files will be in the `dist/` directory.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Key Features Implementation

- **Error Boundaries** - Catches React errors and displays fallback UI
- **Optimistic Updates** - Immediate UI feedback for better UX
- **Type Safety** - Strict TypeScript with comprehensive type definitions
- **Accessibility** - WCAG compliant with keyboard navigation
- **Performance** - Code splitting, lazy loading, and React Query caching

## Database Schema

The application uses the following main tables:

- `users` - User accounts and admin flags
- `meals` - Meal recipes with ingredients and instructions
- `favorites` - User favorite meals (many-to-many)
- `user_history` - Meal generation history

All tables have Row Level Security (RLS) policies enabled.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues or questions, please open an issue on GitHub.

# Meal Planner Application

A modern, full-featured meal planning application built with React, TypeScript, and Supabase. This application allows users to browse, search, and favorite meals, while administrators can manage the meal database through a powerful admin panel.

## Features

### User Features
- Browse meals by category (Breakfast, Lunch, Dinner, Snacks)
- Search meals by name or ingredients
- View detailed meal information including ingredients and step-by-step instructions
- Favorite meals for quick access
- View meal preparation time and difficulty level
- Responsive design for mobile and desktop

### Admin Features
- Complete CRUD operations for meals
- Bulk import meals via JSON
- Image preview when adding/editing meals
- Dynamic ingredient and instruction management
- Filter and sort meals
- User-friendly modal-based forms with validation

### Technical Features
- TypeScript for type safety
- React Hook Form with Zod validation
- TanStack Query (React Query) for data fetching and caching
- Supabase for backend and authentication
- Row Level Security (RLS) for data protection
- Tailwind CSS for styling
- Vite for fast development and building

## Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Routing**: React Router DOM

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- A Supabase account

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project dashboard under Settings > API.

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd meal-planner-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Set up Supabase**

   Follow the detailed instructions in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to:
   - Create database tables
   - Set up Row Level Security policies
   - Configure authentication
   - Get your API credentials

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

Build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
meal-planner-app/
├── public/                  # Static assets
├── seed-data/              # Seed data for database
│   └── meals.json          # Sample meal data (50+ meals)
├── src/
│   ├── lib/                # Library configurations
│   │   └── supabase.ts     # Supabase client setup
│   ├── pages/              # Page components
│   │   └── admin/          # Admin panel
│   │       ├── index.tsx   # Admin dashboard
│   │       ├── MealFormModal.tsx  # Meal create/edit form
│   │       └── ImportModal.tsx    # Bulk import modal
│   ├── services/           # API services
│   │   └── mealService.ts  # Meal CRUD operations
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts        # Shared types
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Application entry point
├── .env                    # Environment variables (create this)
├── package.json            # Project dependencies
├── README.md              # This file
├── SUPABASE_SETUP.md      # Supabase setup guide
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## Seeding Data

The application includes a seed file with 50+ diverse meal recipes covering all categories.

### Method 1: Using the Admin Panel (Recommended)

1. Navigate to `/admin`
2. Click "Import Meals"
3. Click "Load sample data from seed-data/meals.json"
4. Click "Import Meals"

### Method 2: Direct Database Insert

You can also insert data directly using Supabase SQL Editor. See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for details.

## Admin Panel Access

To access the admin panel:

1. Navigate to `/admin`
2. Ensure you're authenticated as an admin user
3. Set up admin permissions in Supabase (see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md))

### Admin Panel Features

- **View All Meals**: See all meals in a sortable, filterable table
- **Create Meal**: Add new meals with the form modal
- **Edit Meal**: Modify existing meals
- **Delete Meal**: Remove meals from the database
- **Import Meals**: Bulk import from JSON

## Deployment

### Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Deploy to Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to Netlify

3. Add environment variables in Netlify dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Deploy to Other Platforms

The application can be deployed to any static hosting service that supports single-page applications:
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront
- Azure Static Web Apps

Make sure to:
1. Build the project with `npm run build`
2. Configure environment variables
3. Set up proper redirects for client-side routing

## API Reference

### Meal Service

The `mealService` provides methods for interacting with the meals database:

```typescript
// Get all meals
mealService.getAllMeals(): Promise<Meal[]>

// Get meal by ID
mealService.getMealById(id: string): Promise<Meal | null>

// Get meals by category
mealService.getMealsByCategory(category: string): Promise<Meal[]>

// Create meal
mealService.createMeal(mealData: Omit<Meal, 'id'>): Promise<Meal>

// Update meal
mealService.updateMeal(id: string, mealData: Partial<Meal>): Promise<Meal>

// Delete meal
mealService.deleteMeal(id: string): Promise<void>

// Import meals
mealService.importMeals(meals: Omit<Meal, 'id'>[]): Promise<{ count: number }>

// Search meals
mealService.searchMeals(query: string): Promise<Meal[]>
```

## Database Schema

### Meals Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Meal name |
| category | TEXT | breakfast, lunch, dinner, or snack |
| difficulty | TEXT | easy, medium, or hard |
| prep_time | INTEGER | Preparation time in minutes |
| image_url | TEXT | URL to meal image |
| ingredients | JSONB | Array of ingredient strings |
| instructions | JSONB | Array of instruction strings |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

### Favorites Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| meal_id | UUID | Foreign key to meals |
| created_at | TIMESTAMP | Creation timestamp |

### User History Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| meal_id | UUID | Foreign key to meals |
| viewed_at | TIMESTAMP | View timestamp |

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## Troubleshooting

### Common Issues

**Issue**: "Invalid API key" error
- **Solution**: Check that your `.env` file has the correct Supabase URL and anon key

**Issue**: "Row level security policy violation"
- **Solution**: Ensure RLS policies are set up correctly (see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md))

**Issue**: Images not loading
- **Solution**: Verify image URLs are valid and accessible

**Issue**: Import not working
- **Solution**: Check that the JSON format matches the expected schema

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

## Acknowledgments

- Meal images from [Unsplash](https://unsplash.com)
- Built with [Supabase](https://supabase.com)
- UI components styled with [Tailwind CSS](https://tailwindcss.com)

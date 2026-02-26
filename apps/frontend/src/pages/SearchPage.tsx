import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { DishCard } from '@/components/DishCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { useSearchDishes } from '@/hooks/useDishes';

export function SearchPage() {
  const [query, setQuery] = useState('');
  const { data: dishes, isLoading } = useSearchDishes(query);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto mb-12"
      >
        <h1 className="text-4xl font-bold mb-6 text-center">Search Recipes</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, ingredient, or tag..."
            className="pl-10 text-lg h-14"
          />
        </div>
      </motion.div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-xl" />
          ))}
        </div>
      )}

      {dishes && dishes.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </motion.div>
      )}

      {query && dishes && dishes.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-semibold mb-2">No recipes found</h3>
          <p className="text-muted-foreground">
            Try searching with different keywords
          </p>
        </motion.div>
      )}

      {!query && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-semibold mb-2">Start Searching</h3>
          <p className="text-muted-foreground">
            Enter a recipe name, ingredient, or tag above
          </p>
        </motion.div>
      )}
    </div>
  );
}

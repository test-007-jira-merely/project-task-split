import { Heart } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { useNavigate } from 'react-router-dom';

export function FavoritesPage() {
  const navigate = useNavigate();

  // This will be populated from the state store in the next subtask
  const favorites: any[] = [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Your Favorites</h1>
        <p className="text-muted text-lg">
          All the dishes you've loved, in one place
        </p>
      </div>

      {favorites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No Favorites Yet"
          description="Start exploring and heart the dishes you love to see them here"
          action={{
            label: 'Explore Recipes',
            onClick: () => navigate('/explore'),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* DishCards will be rendered here after API integration */}
        </div>
      )}
    </div>
  );
}

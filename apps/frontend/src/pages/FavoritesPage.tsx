import { Heart } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';

export default function FavoritesPage() {
  // Placeholder for favorites functionality
  // In production, this would fetch user's favorites from the API

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Your Favorites</h1>
        <p className="text-text-secondary">Save your favorite recipes for quick access</p>
      </div>

      <EmptyState
        icon={Heart}
        title="No favorites yet"
        description="Start exploring and save recipes you love to see them here"
      />
    </div>
  );
}

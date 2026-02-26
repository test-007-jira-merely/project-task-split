import { useState } from 'react';
import { IngredientEngine } from '@/components/ingredients/IngredientEngine';
import { EmptyState } from '@/components/ui/EmptyState';
import { Search } from 'lucide-react';

export function ExplorePage() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleAddIngredient = (ingredient: string) => {
    if (!ingredients.includes(ingredient)) {
      setIngredients([...ingredients, ingredient]);
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter((i) => i !== ingredient));
  };

  const handleSearch = () => {
    setIsSearching(true);
    // This will be connected to the API in the next subtask
    setTimeout(() => {
      setIsSearching(false);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Explore Recipes</h1>
        <p className="text-muted text-lg">
          Find the perfect dish based on ingredients you have at home
        </p>
      </div>

      <IngredientEngine
        ingredients={ingredients}
        onAdd={handleAddIngredient}
        onRemove={handleRemoveIngredient}
        onSearch={handleSearch}
        isSearching={isSearching}
      />

      {/* Results will be displayed here after API integration */}
      <EmptyState
        icon={Search}
        title="Start Adding Ingredients"
        description="Add the ingredients you have available, and we'll find matching recipes for you"
      />
    </div>
  );
}

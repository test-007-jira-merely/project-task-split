import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Search } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import { useDishStore } from '../stores/dish.store';
import { useIngredientStore } from '../stores/ingredient.store';
import DishCard from '../components/dish/DishCard';
import IngredientInput from '../components/ingredient/IngredientInput';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';

export default function HomePage() {
  const { currentDish, setCurrentDish, addToDishHistory } = useDishStore();
  const { ingredients } = useIngredientStore();
  const [viewMode, setViewMode] = useState<'random' | 'match'>('random');

  // Random dish generation
  const randomDishMutation = useMutation({
    mutationFn: () => apiClient.getRandomDish(),
    onSuccess: (response) => {
      if (response.data) {
        setCurrentDish(response.data);
        addToDishHistory(response.data);
      }
    },
  });

  // Ingredient matching
  const matchingMutation = useMutation({
    mutationFn: () =>
      apiClient.matchIngredients({
        ingredients,
        maxResults: 10,
        minCoverage: 30,
      }),
  });

  const handleGenerateRandom = () => {
    setViewMode('random');
    randomDishMutation.mutate();
  };

  const handleMatchIngredients = () => {
    if (ingredients.length === 0) return;
    setViewMode('match');
    matchingMutation.mutate();
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 bg-clip-text text-transparent">
          Discover Your Next Meal
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          Generate random meal ideas or find perfect recipes based on ingredients you already have
        </p>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleGenerateRandom}
          disabled={randomDishMutation.isPending}
          className="btn-primary text-base py-4 px-8 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          {randomDishMutation.isPending ? 'Generating...' : 'Generate Random Meal'}
        </button>
      </div>

      {/* Ingredient Matching Section */}
      <div className="max-w-2xl mx-auto">
        <IngredientInput />

        {ingredients.length > 0 && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleMatchIngredients}
              disabled={matchingMutation.isPending}
              className="btn-primary"
            >
              <Search className="w-5 h-5 mr-2" />
              {matchingMutation.isPending ? 'Searching...' : 'Find Matching Recipes'}
            </button>
          </div>
        )}
      </div>

      {/* Results Section */}
      <div className="max-w-3xl mx-auto">
        {viewMode === 'random' && (
          <>
            {randomDishMutation.isPending && <LoadingSkeleton />}
            {randomDishMutation.isError && (
              <EmptyState
                icon={Sparkles}
                title="Something went wrong"
                description="Failed to generate a meal. Please try again."
                action={
                  <button onClick={handleGenerateRandom} className="btn-primary">
                    Try Again
                  </button>
                }
              />
            )}
            {currentDish && !randomDishMutation.isPending && <DishCard dish={currentDish} />}
            {!currentDish && !randomDishMutation.isPending && !randomDishMutation.isError && (
              <EmptyState
                icon={Sparkles}
                title="Ready to discover?"
                description="Click the button above to generate a random meal idea."
              />
            )}
          </>
        )}

        {viewMode === 'match' && (
          <>
            {matchingMutation.isPending && <LoadingSkeleton />}
            {matchingMutation.isError && (
              <EmptyState
                icon={Search}
                title="Something went wrong"
                description="Failed to find matching recipes. Please try again."
                action={
                  <button onClick={handleMatchIngredients} className="btn-primary">
                    Try Again
                  </button>
                }
              />
            )}
            {matchingMutation.data?.data && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">
                    Found {matchingMutation.data.data.totalMatches} Matching Recipes
                  </h2>
                  <p className="text-text-secondary">
                    Search completed in {matchingMutation.data.data.searchTime}ms
                  </p>
                </div>

                {matchingMutation.data.data.results.map((result) => (
                  <div key={result.dish.id} className="relative">
                    <DishCard dish={result.dish} />

                    {/* Match Score Overlay */}
                    <div className="mt-3 p-4 bg-surface border border-border rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Match Score</span>
                        <span className="text-lg font-bold text-primary-600">
                          {result.matchScore.coveragePercentage.toFixed(0)}% match
                        </span>
                      </div>
                      <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${result.matchScore.coveragePercentage}%` }}
                          className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
                        />
                      </div>
                      <div className="mt-2 text-xs text-text-secondary">
                        {result.matchScore.matchedCount} of {result.matchScore.totalIngredients} ingredients matched
                        {result.matchScore.missingIngredients.length > 0 && (
                          <> · Missing: {result.matchScore.missingIngredients.slice(0, 3).join(', ')}
                            {result.matchScore.missingIngredients.length > 3 && ` +${result.matchScore.missingIngredients.length - 3} more`}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

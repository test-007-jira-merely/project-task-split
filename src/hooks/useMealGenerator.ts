import { useState } from 'react';
import { Meal } from '@/types/models';
import { useMealStore } from '@/stores/useMealStore';

export function useMealGenerator(meals: Meal[]) {
  const { lastGeneratedMealId, setCurrentMeal, setLastGeneratedMealId } = useMealStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateRandomMeal = async () => {
    if (meals.length === 0) return null;

    setIsGenerating(true);

    // Simulate animation delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    let availableMeals = meals;

    // Exclude last generated meal if there's more than one meal
    if (lastGeneratedMealId && meals.length > 1) {
      availableMeals = meals.filter((meal) => meal.id !== lastGeneratedMealId);
    }

    const randomIndex = Math.floor(Math.random() * availableMeals.length);
    const selectedMeal = availableMeals[randomIndex];

    setCurrentMeal(selectedMeal);
    setLastGeneratedMealId(selectedMeal.id);
    setIsGenerating(false);

    return selectedMeal;
  };

  return { generateRandomMeal, isGenerating };
}

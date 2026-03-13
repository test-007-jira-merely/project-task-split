import { useState, useCallback } from 'react';
import { useAppStore } from '@stores/useAppStore';
import { useMeals } from '@hooks/useMeals';
import { mealService } from '@services/mealService';

export function useMealGenerator() {
  const { meals } = useMeals();
  const { currentMeal, setCurrentMeal, lastGeneratedMealId, setLastGeneratedMealId, user, addToHistory } = useAppStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateRandomMeal = useCallback(async () => {
    if (meals.length === 0) return;

    setIsGenerating(true);

    setTimeout(async () => {
      const availableMeals = meals.filter(m => m.id !== lastGeneratedMealId);
      const mealsToChooseFrom = availableMeals.length > 0 ? availableMeals : meals;
      const randomMeal = mealsToChooseFrom[Math.floor(Math.random() * mealsToChooseFrom.length)];

      setCurrentMeal(randomMeal);
      setLastGeneratedMealId(randomMeal.id);
      addToHistory(randomMeal);

      if (user) {
        try {
          await mealService.addToHistory(user.id, randomMeal.id);
        } catch (error) {
          console.error('Failed to save to history:', error);
        }
      }

      setIsGenerating(false);
    }, 500);
  }, [meals, lastGeneratedMealId, setCurrentMeal, setLastGeneratedMealId, addToHistory, user]);

  return {
    currentMeal,
    generateRandomMeal,
    isGenerating,
  };
}

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { mealService } from '@/services/mealService';
import { supabase } from '@/services/supabase';
import { useAppStore } from '@/stores/useAppStore';
import { Meal } from '@/types/meal';

export const useMealGenerator = () => {
  const { user, lastGeneratedMealId, setLastGeneratedMealId, setCurrentMeal } = useAppStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: meals = [], isLoading } = useQuery({
    queryKey: ['meals'],
    queryFn: mealService.getAll,
  });

  const generateMeal = async (): Promise<Meal | null> => {
    if (meals.length === 0) return null;

    setIsGenerating(true);

    let availableMeals = meals;
    if (lastGeneratedMealId) {
      availableMeals = meals.filter((m) => m.id !== lastGeneratedMealId);
      if (availableMeals.length === 0) availableMeals = meals;
    }

    const randomIndex = Math.floor(Math.random() * availableMeals.length);
    const selectedMeal = availableMeals[randomIndex];

    if (user) {
      await supabase.from('user_history').insert({
        user_id: user.id,
        meal_id: selectedMeal.id,
      });
    }

    setLastGeneratedMealId(selectedMeal.id);
    setCurrentMeal(selectedMeal);

    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsGenerating(false);

    return selectedMeal;
  };

  return {
    meals,
    isLoading,
    isGenerating,
    generateMeal,
  };
};

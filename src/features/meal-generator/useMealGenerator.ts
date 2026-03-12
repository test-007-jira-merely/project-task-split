import { useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { Meal } from '@/types';
import mealsData from '@/data/meals.json';

export const useMealGenerator = () => {
  const { currentMeal, lastGeneratedMealId, setCurrentMeal, setLastGeneratedMealId } = useAppStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateMeal = async () => {
    setIsGenerating(true);

    // Simulate loading for smooth animation
    await new Promise(resolve => setTimeout(resolve, 500));

    const meals = mealsData as Meal[];
    const availableMeals = meals.filter(m => m.id !== lastGeneratedMealId);
    const randomMeal = availableMeals[Math.floor(Math.random() * availableMeals.length)];

    setCurrentMeal(randomMeal);
    setLastGeneratedMealId(randomMeal.id);
    setIsGenerating(false);

    return randomMeal;
  };

  return {
    currentMeal,
    generateMeal,
    isGenerating,
  };
};

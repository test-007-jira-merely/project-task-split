import { describe, it, expect, beforeEach } from 'vitest';
import { useDishStore } from '../dish-store';
import { Dish } from '@meal-platform/shared';

const mockDish: Dish = {
  id: '1',
  name: 'Test Dish',
  description: 'A test dish',
  imageUrl: 'https://example.com/image.jpg',
  ingredients: [],
  instructions: [],
  category: 'dinner',
  difficulty: 3,
  prepTime: 15,
  cookTime: 30,
  nutrition: { calories: 500, protein: 20, fat: 15, carbs: 60 },
};

describe('DishStore', () => {
  beforeEach(() => {
    useDishStore.setState({
      currentDish: null,
      dishHistory: [],
      favorites: new Set(),
    });
  });

  it('should set current dish', () => {
    const { setCurrentDish } = useDishStore.getState();
    setCurrentDish(mockDish);
    expect(useDishStore.getState().currentDish).toEqual(mockDish);
  });

  it('should add dish to history', () => {
    const { addToHistory } = useDishStore.getState();
    addToHistory(mockDish);
    expect(useDishStore.getState().dishHistory).toHaveLength(1);
    expect(useDishStore.getState().dishHistory[0]).toEqual(mockDish);
  });

  it('should toggle favorites', () => {
    const { toggleFavorite, isFavorite } = useDishStore.getState();
    expect(isFavorite('1')).toBe(false);
    toggleFavorite('1');
    expect(useDishStore.getState().favorites.has('1')).toBe(true);
  });

  it('should clear history', () => {
    const { addToHistory, clearHistory } = useDishStore.getState();
    addToHistory(mockDish);
    expect(useDishStore.getState().dishHistory).toHaveLength(1);
    clearHistory();
    expect(useDishStore.getState().dishHistory).toHaveLength(0);
  });
});

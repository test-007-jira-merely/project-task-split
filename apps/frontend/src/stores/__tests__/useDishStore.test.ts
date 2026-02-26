import { describe, it, expect, beforeEach } from 'vitest';
import { useDishStore } from '../useDishStore';
import { Dish } from '@meal-platform/shared';

const mockDish: Dish = {
  id: '1',
  name: 'Test Dish',
  description: 'A test dish',
  imageUrl: 'https://example.com/image.jpg',
  ingredients: [],
  instructions: [],
  category: 'lunch',
  difficulty: 3,
  prepTime: 10,
  cookTime: 20,
  nutrition: { calories: 500, protein: 20, fat: 15, carbs: 60 },
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('useDishStore', () => {
  beforeEach(() => {
    // Reset store
    const { clearHistory, setCurrentDish } = useDishStore.getState();
    clearHistory();
    setCurrentDish(null);
  });

  it('should set current dish', () => {
    const { setCurrentDish } = useDishStore.getState();
    
    setCurrentDish(mockDish);
    
    expect(useDishStore.getState().currentDish).toEqual(mockDish);
  });

  it('should add dish to history', () => {
    const { addToHistory } = useDishStore.getState();
    
    addToHistory(mockDish);
    
    expect(useDishStore.getState().dishHistory).toContainEqual(mockDish);
  });

  it('should not duplicate dishes in history', () => {
    const { addToHistory } = useDishStore.getState();
    
    addToHistory(mockDish);
    addToHistory(mockDish);
    
    expect(useDishStore.getState().dishHistory.length).toBe(1);
  });

  it('should limit history to 20 dishes', () => {
    const { addToHistory } = useDishStore.getState();
    
    // Add 25 dishes
    for (let i = 0; i < 25; i++) {
      addToHistory({ ...mockDish, id: i.toString() });
    }
    
    expect(useDishStore.getState().dishHistory.length).toBe(20);
  });

  it('should get recent dishes with limit', () => {
    const { addToHistory, getRecentDishes } = useDishStore.getState();
    
    // Add 10 dishes
    for (let i = 0; i < 10; i++) {
      addToHistory({ ...mockDish, id: i.toString() });
    }
    
    const recent = getRecentDishes(5);
    
    expect(recent.length).toBe(5);
  });

  it('should clear history', () => {
    const { addToHistory, clearHistory } = useDishStore.getState();
    
    addToHistory(mockDish);
    clearHistory();
    
    expect(useDishStore.getState().dishHistory.length).toBe(0);
  });

  it('should manage loading state', () => {
    const { setLoading } = useDishStore.getState();
    
    setLoading(true);
    expect(useDishStore.getState().isLoading).toBe(true);
    
    setLoading(false);
    expect(useDishStore.getState().isLoading).toBe(false);
  });

  it('should manage error state', () => {
    const { setError } = useDishStore.getState();
    
    setError('Test error');
    expect(useDishStore.getState().error).toBe('Test error');
    
    setError(null);
    expect(useDishStore.getState().error).toBeNull();
  });
});

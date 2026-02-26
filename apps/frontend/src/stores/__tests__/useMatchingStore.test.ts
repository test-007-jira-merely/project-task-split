import { describe, it, expect, beforeEach } from 'vitest';
import { useMatchingStore } from '../useMatchingStore';

describe('useMatchingStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const { clearIngredients } = useMatchingStore.getState();
    clearIngredients();
  });

  it('should add ingredients', () => {
    const { addIngredient } = useMatchingStore.getState();
    
    addIngredient('chicken');
    
    expect(useMatchingStore.getState().userIngredients).toContain('chicken');
  });

  it('should normalize ingredients to lowercase', () => {
    const { addIngredient } = useMatchingStore.getState();
    
    addIngredient('CHICKEN');
    
    expect(useMatchingStore.getState().userIngredients).toContain('chicken');
  });

  it('should not add duplicate ingredients', () => {
    const { addIngredient } = useMatchingStore.getState();
    
    addIngredient('chicken');
    addIngredient('chicken');
    
    expect(useMatchingStore.getState().userIngredients.length).toBe(1);
  });

  it('should remove ingredients', () => {
    const { addIngredient, removeIngredient } = useMatchingStore.getState();
    
    addIngredient('chicken');
    addIngredient('beef');
    removeIngredient('chicken');
    
    expect(useMatchingStore.getState().userIngredients).not.toContain('chicken');
    expect(useMatchingStore.getState().userIngredients).toContain('beef');
  });

  it('should clear all ingredients', () => {
    const { addIngredient, clearIngredients } = useMatchingStore.getState();
    
    addIngredient('chicken');
    addIngredient('beef');
    clearIngredients();
    
    expect(useMatchingStore.getState().userIngredients.length).toBe(0);
  });

  it('should return correct ingredient count', () => {
    const { addIngredient, ingredientCount } = useMatchingStore.getState();
    
    addIngredient('chicken');
    addIngredient('beef');
    
    expect(ingredientCount()).toBe(2);
  });

  it('should return correct hasIngredients status', () => {
    const { addIngredient, hasIngredients } = useMatchingStore.getState();
    
    expect(hasIngredients()).toBe(false);
    
    addIngredient('chicken');
    
    expect(hasIngredients()).toBe(true);
  });
});

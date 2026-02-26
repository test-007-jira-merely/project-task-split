import type { Dish, MatchResult } from '@meal-platform/shared';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    const result: ApiResponse<T> = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Unknown error');
    }

    return result.data as T;
  }

  // Dishes
  async getRandomDish(): Promise<Dish> {
    return this.request<Dish>('/dishes/random');
  }

  async getAllDishes(): Promise<Dish[]> {
    return this.request<Dish[]>('/dishes');
  }

  async getDishById(id: string): Promise<Dish> {
    return this.request<Dish>(`/dishes/${id}`);
  }

  async searchDishes(query: string): Promise<Dish[]> {
    return this.request<Dish[]>(`/dishes/search?q=${encodeURIComponent(query)}`);
  }

  async getDishesByCategory(category: string): Promise<Dish[]> {
    return this.request<Dish[]>(`/dishes/category/${category}`);
  }

  // Matching
  async findMatches(
    ingredients: string[],
    allowSubstitutes: boolean = true,
    maxResults: number = 10
  ): Promise<MatchResult[]> {
    return this.request<MatchResult[]>('/matching', {
      method: 'POST',
      body: JSON.stringify({ ingredients, allowSubstitutes, maxResults }),
    });
  }

  // Favorites
  async getFavorites(userId?: string): Promise<any[]> {
    const query = userId ? `?userId=${userId}` : '';
    return this.request<any[]>(`/favorites${query}`);
  }

  async addFavorite(dishId: string, userId?: string): Promise<any> {
    return this.request<any>('/favorites', {
      method: 'POST',
      body: JSON.stringify({ dishId, userId }),
    });
  }

  async removeFavorite(dishId: string, userId?: string): Promise<any> {
    return this.request<any>('/favorites', {
      method: 'DELETE',
      body: JSON.stringify({ dishId, userId }),
    });
  }

  async isFavorite(dishId: string, userId?: string): Promise<{ isFavorite: boolean }> {
    const query = `?dishId=${dishId}${userId ? `&userId=${userId}` : ''}`;
    return this.request<{ isFavorite: boolean }>(`/favorites/check${query}`);
  }

  // History
  async getHistory(userId?: string, limit?: number): Promise<any[]> {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (limit) params.append('limit', limit.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<any[]>(`/history${query}`);
  }

  async addToHistory(dishId: string, userId?: string): Promise<any> {
    return this.request<any>('/history', {
      method: 'POST',
      body: JSON.stringify({ dishId, userId }),
    });
  }

  async clearHistory(userId?: string): Promise<{ success: boolean }> {
    const query = userId ? `?userId=${userId}` : '';
    return this.request<{ success: boolean }>(`/history${query}`, {
      method: 'DELETE',
    });
  }

  // Health
  async getHealth(): Promise<any> {
    return this.request<any>('/health');
  }
}

export const apiClient = new ApiClient();

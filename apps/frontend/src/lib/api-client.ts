import {
  Dish,
  MatchRequest,
  MatchResponse,
  ApiResponse,
  HealthCheck,
} from '@meal-platform/shared-types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Dishes
  async getRandomDish(category?: string): Promise<ApiResponse<Dish>> {
    const query = category ? `?category=${category}` : '';
    return this.request(`/dishes/random${query}`, { method: 'POST' });
  }

  async getDishById(id: string): Promise<ApiResponse<Dish>> {
    return this.request(`/dishes/${id}`);
  }

  async getDishes(filters?: {
    category?: string;
    maxDifficulty?: number;
  }): Promise<ApiResponse<Dish[]>> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.maxDifficulty) params.append('maxDifficulty', String(filters.maxDifficulty));

    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/dishes${query}`);
  }

  // Matching
  async matchIngredients(request: MatchRequest): Promise<ApiResponse<MatchResponse>> {
    return this.request('/matching', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Favorites
  async getFavorites(userId: string): Promise<ApiResponse<Dish[]>> {
    return this.request(`/favorites?userId=${userId}`);
  }

  async addFavorite(userId: string, dishId: string): Promise<ApiResponse<void>> {
    return this.request(`/favorites/${dishId}?userId=${userId}`, {
      method: 'POST',
    });
  }

  async removeFavorite(userId: string, dishId: string): Promise<ApiResponse<void>> {
    return this.request(`/favorites/${dishId}?userId=${userId}`, {
      method: 'DELETE',
    });
  }

  // History
  async getHistory(userId: string, limit?: number): Promise<ApiResponse<Dish[]>> {
    const query = limit ? `?userId=${userId}&limit=${limit}` : `?userId=${userId}`;
    return this.request(`/history${query}`);
  }

  async addToHistory(
    userId: string,
    dishId: string,
    cooked?: boolean
  ): Promise<ApiResponse<void>> {
    return this.request('/history', {
      method: 'POST',
      body: JSON.stringify({ userId, dishId, cooked }),
    });
  }

  async getUserPreferences(userId: string) {
    return this.request(`/history/preferences?userId=${userId}`);
  }

  // Health
  async healthCheck(): Promise<HealthCheck> {
    return this.request('/health');
  }
}

export const apiClient = new ApiClient(API_URL);

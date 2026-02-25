import { Dish, IngredientMatchRequest, ApiResponse, RandomDishRequest, IngredientMatchResponse } from '@meal-platform/shared';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'API request failed' }));
    throw new Error(error.message || 'API request failed');
  }

  const data = await response.json();
  return data;
}

export const apiClient = {
  getHealth: () => fetchApi('/health'),

  getRandomDish: (params?: RandomDishRequest) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.maxDifficulty) query.append('maxDifficulty', params.maxDifficulty.toString());
    if (params?.excludeIds?.length) {
      params.excludeIds.forEach((id: string) => query.append('excludeIds', id));
    }
    const queryString = query.toString();
    return fetchApi<ApiResponse<Dish>>(`/dishes/random${queryString ? '?' + queryString : ''}`);
  },

  getDishById: (id: string) =>
    fetchApi<ApiResponse<Dish>>(`/dishes/${id}`),

  getAllDishes: (params?: { page?: number; limit?: number; category?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.category) query.append('category', params.category);
    const queryString = query.toString();
    return fetchApi<ApiResponse<{ dishes: Dish[]; total: number; page: number; limit: number }>>(
      `/dishes${queryString ? '?' + queryString : ''}`
    );
  },

  matchIngredients: (request: IngredientMatchRequest) =>
    fetchApi<ApiResponse<IngredientMatchResponse>>(`/dishes/match`, {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  getIngredientSuggestions: (query: string) =>
    fetchApi<ApiResponse<string[]>>(`/ingredients/suggestions?q=${encodeURIComponent(query)}`),
};

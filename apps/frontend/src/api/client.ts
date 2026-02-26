import {
  Dish,
  MatchRequest,
  MatchResponse,
  UserFavorite,
  UserHistory,
  CreateFavoriteDto,
  CreateHistoryDto,
  RecommendationRequest,
  RecommendationResponse,
  HealthCheckResponse,
} from '@meal-platform/shared';

class ApiClient {
  private baseUrl: string;
  private retries: number;
  private timeout: number;

  constructor(config: { baseUrl?: string; retries?: number; timeout?: number } = {}) {
    this.baseUrl = config.baseUrl || import.meta.env.VITE_API_URL || '/api';
    this.retries = config.retries || 3;
    this.timeout = config.timeout || 10000;
  }

  private async fetchWithRetry<T>(
    url: string,
    options: RequestInit = {},
    attempt = 1
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (attempt < this.retries && !(error instanceof Error && error.name === 'AbortError')) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        return this.fetchWithRetry<T>(url, options, attempt + 1);
      }

      throw error;
    }
  }

  // Dish endpoints
  async getRandomDish(excludeIds?: string[]): Promise<Dish> {
    const query = excludeIds?.length ? `?excludeIds=${excludeIds.join(',')}` : '';
    return this.fetchWithRetry<Dish>(`/dishes/random${query}`);
  }

  async getDishById(id: string): Promise<Dish> {
    return this.fetchWithRetry<Dish>(`/dishes/${id}`);
  }

  async getAllDishes(filters?: { category?: string }): Promise<Dish[]> {
    const query = filters?.category ? `?category=${filters.category}` : '';
    return this.fetchWithRetry<Dish[]>(`/dishes${query}`);
  }

  // Matching endpoints
  async findMatchingDishes(request: MatchRequest): Promise<MatchResponse> {
    return this.fetchWithRetry<MatchResponse>('/matching/find', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Favorites endpoints
  async addFavorite(dto: CreateFavoriteDto): Promise<UserFavorite> {
    return this.fetchWithRetry<UserFavorite>('/user-activity/favorites', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  }

  async removeFavorite(userId: string, dishId: string): Promise<void> {
    return this.fetchWithRetry<void>(`/user-activity/favorites/${userId}/${dishId}`, {
      method: 'DELETE',
    });
  }

  async getUserFavorites(userId: string): Promise<UserFavorite[]> {
    return this.fetchWithRetry<UserFavorite[]>(`/user-activity/favorites/${userId}`);
  }

  // History endpoints
  async addHistoryEntry(dto: CreateHistoryDto): Promise<UserHistory> {
    return this.fetchWithRetry<UserHistory>('/user-activity/history', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  }

  async getUserHistory(userId: string, limit?: number): Promise<UserHistory[]> {
    const query = limit ? `?limit=${limit}` : '';
    return this.fetchWithRetry<UserHistory[]>(`/user-activity/history/${userId}${query}`);
  }

  // Recommendations
  async getRecommendations(request: RecommendationRequest): Promise<RecommendationResponse> {
    return this.fetchWithRetry<RecommendationResponse>('/user-activity/recommendations', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Health check
  async healthCheck(): Promise<HealthCheckResponse> {
    return this.fetchWithRetry<HealthCheckResponse>('/health');
  }
}

export const apiClient = new ApiClient();

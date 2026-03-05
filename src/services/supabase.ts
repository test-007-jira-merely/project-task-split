import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User, SupabaseMeal, Favorite, UserHistory } from '@/types';
import type { SupabaseService } from '../../.contracts-beezi/services/supabase.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

class SupabaseServiceImpl implements SupabaseService {
  client: SupabaseClient;

  constructor() {
    this.client = createClient(supabaseUrl, supabaseAnonKey);
  }

  // Auth
  async signUp(email: string, password: string) {
    const { data, error } = await this.client.auth.signUp({ email, password });
    return {
      user: data.user ? { id: data.user.id, email: data.user.email!, created_at: data.user.created_at || '' } : null,
      error: error as Error | null,
    };
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.client.auth.signInWithPassword({ email, password });
    return {
      user: data.user ? { id: data.user.id, email: data.user.email!, created_at: data.user.created_at || '' } : null,
      error: error as Error | null,
    };
  }

  async signOut() {
    const { error } = await this.client.auth.signOut();
    return { error: error as Error | null };
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await this.client.auth.getUser();
    if (!user) return null;

    // Check if user is admin
    const { data: userData } = await this.client
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    return {
      id: user.id,
      email: user.email!,
      created_at: user.created_at || '',
      is_admin: userData?.is_admin || false,
    };
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    const { data: { subscription } } = this.client.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const user = await this.getCurrentUser();
        callback(user);
      } else {
        callback(null);
      }
    });
    return () => subscription.unsubscribe();
  }

  // Meals
  async getMeals(): Promise<SupabaseMeal[]> {
    const { data, error } = await this.client.from('meals').select('*');
    if (error) throw error;
    return data || [];
  }

  async getMealById(id: string): Promise<SupabaseMeal | null> {
    const { data, error } = await this.client.from('meals').select('*').eq('id', id).single();
    if (error) return null;
    return data;
  }

  async createMeal(meal: Omit<SupabaseMeal, 'id' | 'created_at'>): Promise<SupabaseMeal> {
    const { data, error } = await this.client.from('meals').insert(meal).select().single();
    if (error) throw error;
    return data;
  }

  async updateMeal(id: string, meal: Partial<SupabaseMeal>): Promise<SupabaseMeal> {
    const { data, error } = await this.client.from('meals').update(meal).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  async deleteMeal(id: string): Promise<void> {
    const { error } = await this.client.from('meals').delete().eq('id', id);
    if (error) throw error;
  }

  async importMeals(meals: SupabaseMeal[]): Promise<void> {
    const { error } = await this.client.from('meals').insert(meals);
    if (error) throw error;
  }

  // Favorites
  async getFavorites(userId: string): Promise<Favorite[]> {
    const { data, error } = await this.client.from('favorites').select('*').eq('user_id', userId);
    if (error) throw error;
    return data || [];
  }

  async addFavorite(userId: string, mealId: string): Promise<Favorite> {
    const { data, error } = await this.client
      .from('favorites')
      .insert({ user_id: userId, meal_id: mealId })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async removeFavorite(userId: string, mealId: string): Promise<void> {
    const { error } = await this.client
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('meal_id', mealId);
    if (error) throw error;
  }

  async isFavorite(userId: string, mealId: string): Promise<boolean> {
    const { data, error } = await this.client
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('meal_id', mealId)
      .single();
    return !error && !!data;
  }

  // History
  async getHistory(userId: string, limit: number = 50): Promise<UserHistory[]> {
    const { data, error } = await this.client
      .from('user_history')
      .select('*')
      .eq('user_id', userId)
      .order('generated_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  }

  async addToHistory(userId: string, mealId: string): Promise<UserHistory> {
    const { data, error } = await this.client
      .from('user_history')
      .insert({ user_id: userId, meal_id: mealId, generated_at: new Date().toISOString() })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async clearHistory(userId: string): Promise<void> {
    const { error } = await this.client.from('user_history').delete().eq('user_id', userId);
    if (error) throw error;
  }
}

export const supabaseService = new SupabaseServiceImpl();
export const supabase = supabaseService.client;

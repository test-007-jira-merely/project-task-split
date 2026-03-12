import type { User } from '../types/database';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface IAuthService {
  // Authentication
  signUp(credentials: AuthCredentials): Promise<User>;
  signIn(credentials: AuthCredentials): Promise<User>;
  signOut(): Promise<void>;

  // Session management
  getCurrentUser(): Promise<User | null>;
  getSession(): Promise<{ user: User | null; isAuthenticated: boolean }>;

  // User management
  isAdmin(userId: string): Promise<boolean>;

  // Auth state listener
  onAuthStateChange(callback: (user: User | null) => void): () => void;
}

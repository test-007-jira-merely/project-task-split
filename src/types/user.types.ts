export interface User {
  id: string;
  email: string;
  isAdmin?: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  confirmPassword?: string;
}

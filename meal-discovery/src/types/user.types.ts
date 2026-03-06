export interface User {
  id: string;
  email: string;
  created_at: string;
  isAdmin?: boolean;
}

export interface AuthState {
  user: User | null;
  session: any;
  loading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  confirmPassword: string;
}

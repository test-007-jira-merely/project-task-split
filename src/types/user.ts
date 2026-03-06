export interface User {
  id: string;
  email: string;
  createdAt: string;
  isAdmin?: boolean;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

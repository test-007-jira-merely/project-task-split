export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
}

export interface AuthResponse {
  user: User | null;
  error?: string;
}

export interface User {
  id: string;
  email: string;
  isAdmin?: boolean;
  createdAt: string;
}

export interface UserSession {
  user: User | null;
  accessToken: string | null;
}

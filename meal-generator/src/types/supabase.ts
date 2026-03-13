export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface SupabaseAuthUser {
  id: string;
  email?: string;
  role?: string;
}

import { create } from 'zustand';
import type { AuthUser } from '@/features/auth/types/auth';

interface AuthState {
  enabled: boolean | null;
  phase: 'unknown' | 'authenticated' | 'anonymous' | 'unavailable';
  user: AuthUser | null;
  note: string | null;
}

export const useAuthStore = create<AuthState>(() => ({
  enabled: null,
  phase: 'unknown',
  user: null,
  note: null,
}));

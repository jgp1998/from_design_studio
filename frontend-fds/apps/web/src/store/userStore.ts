import { create } from 'zustand';
import type { UserRole } from '../types';

interface UserState {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

export const useUserStore = create<UserState>((set) => ({
  role: 'guest',
  setRole: (role) => set({ role }),
}));

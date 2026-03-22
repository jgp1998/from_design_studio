import { fetchClient } from './client';
import { UserRole } from '../types';

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
}

export interface RegisterB2BPayload {
  email: string;
  password?: string;
  rut: string;
  companyName: string;
}

export interface RegisterProviderPayload {
  email: string;
  password?: string;
  capacityDescription: string;
  machinesCount: number;
}

export const AuthAPI = {
  login: (data: LoginPayload) => 
    fetchClient<AuthResponse>('/auth/session', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  registerClient: (data: RegisterB2BPayload) => 
    fetchClient<{ message: string }>('/auth/registrations/b2b', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  registerProvider: (data: RegisterProviderPayload) => 
    fetchClient<{ message: string }>('/auth/registrations/provider', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Admin approval
  approveProvider: (providerId: string) => 
    fetchClient<{ message: string }>(`/admin/providers/${providerId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'ACTIVE' }),
    }),
};

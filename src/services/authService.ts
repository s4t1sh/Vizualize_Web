import { api, type ApiSuccess } from './api';
import type { User } from '../types';
import type { LoginValues, RegisterValues } from '../utils/validation';

export interface AuthResult {
  user: User;
  token: string;
}

export async function register(values: RegisterValues): Promise<AuthResult> {
  const res = await api.post<ApiSuccess<AuthResult>>('/auth/register', values);
  return res.data.data;
}

export async function login(values: LoginValues): Promise<AuthResult> {
  const res = await api.post<ApiSuccess<AuthResult>>('/auth/login', values);
  return res.data.data;
}

export async function getCurrentUser(): Promise<User> {
  const res = await api.get<ApiSuccess<{ user: User }>>('/auth/me');
  return res.data.data.user;
}

import axios from 'axios';
import { API_URL } from '../constants/config';

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

interface ApiErrorBody {
  success: false;
  message: string;
  error?: { code?: string; fields?: Record<string, string> };
}

export class ApiError extends Error {
  readonly code: string;
  readonly status?: number;
  readonly fields?: Record<string, string>;

  constructor(message: string, code: string, status?: number, fields?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.fields = fields;
  }
}

/** Single shared HTTP client for the whole website. */
export const api = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  headers: { Accept: 'application/json' },
});

let getToken: () => string | null = () => null;
let onUnauthorized: () => void = () => undefined;

/** Connects the client to the auth store (done once, in authStore). */
export function configureApi(options: { getToken: () => string | null; onUnauthorized: () => void }) {
  getToken = options.getToken;
  onUnauthorized = options.onUnauthorized;
}

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    // A signed-in request was rejected: the session expired, so sign out.
    if (axios.isAxiosError(error) && error.response?.status === 401 && error.config?.headers?.Authorization) {
      onUnauthorized();
    }
    return Promise.reject(toApiError(error));
  },
);

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (axios.isAxiosError(error)) {
    const body = error.response?.data as Partial<ApiErrorBody> | undefined;
    if (error.response && body && typeof body.message === 'string') {
      return new ApiError(body.message, body.error?.code ?? 'UNKNOWN', error.response.status, body.error?.fields);
    }
    if (error.code === 'ECONNABORTED') {
      return new ApiError('The server took too long to respond. Please try again.', 'TIMEOUT');
    }
    if (!error.response) {
      return new ApiError(
        'Cannot reach the Vizualizer server. Make sure it is running and try again.',
        'NETWORK_ERROR',
      );
    }
    return new ApiError('Something went wrong. Please try again.', 'UNKNOWN', error.response.status);
  }

  return new ApiError('Something went wrong. Please try again.', 'UNKNOWN');
}

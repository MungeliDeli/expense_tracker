import type { Expense, ExpenseStats, ExpensesResponse } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || "/api";

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const getToken = (): string | null => localStorage.getItem('token');

const request = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new ApiError(data.message || 'Request failed', response.status);
  }

  return response.json();
};

export const authApi = {
  login: async (password: string) => {
    const data = await request<{ token: string; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
    localStorage.setItem('token', data.token);
    return data;
  },

  logout: async () => {
    await request('/auth/logout', { method: 'POST' });
    localStorage.removeItem('token');
  },

  verify: () => request<{ authenticated: boolean }>('/auth/verify'),
};

export const expensesApi = {
  getAll: (params: Record<string, string | number>) => {
    const query = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ).toString();
    return request<ExpensesResponse>(`/expenses?${query}`);
  },

  getStats: () => request<ExpenseStats>('/expenses/stats'),

  create: (data: Omit<Expense, '_id' | 'createdAt'>) =>
    request<Expense>('/expenses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Omit<Expense, '_id' | 'createdAt'>>) =>
    request<Expense>(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<{ message: string }>(`/expenses/${id}`, { method: 'DELETE' }),
};

export { ApiError };

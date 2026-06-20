import type {
  DashboardStats,
  Expense,
  ExpenseStats,
  ExpensesResponse,
  Income,
  IncomeStats,
  IncomeResponse,
  SavingsEntry,
  SavingsStats,
  SavingsResponse,
} from '../types';

const normalizeApiBase = (value: string | undefined): string => {
  if (!value) return '/api';
  const trimmed = value.replace(/\/$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const API_BASE = normalizeApiBase(import.meta.env.VITE_API_URL);

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const getToken = (): string | null =>
  sessionStorage.getItem('token') || localStorage.getItem('token');

const setToken = (token: string, rememberMe: boolean): void => {
  if (rememberMe) {
    localStorage.setItem('token', token);
    sessionStorage.removeItem('token');
    return;
  }
  sessionStorage.setItem('token', token);
  localStorage.removeItem('token');
};

const clearToken = (): void => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
};

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

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });
  } catch {
    throw new ApiError('Cannot reach the server. Please try again in a moment.', 0);
  }

  if (!response.ok) {
    const contentType = response.headers.get('content-type') || '';
    const data =
      contentType.includes('application/json')
        ? await response.json().catch(() => ({}))
        : {};

    const message =
      (data as { message?: string }).message ||
      (response.status === 401
        ? 'Your session expired. Please sign in again.'
        : response.status >= 500
        ? 'Server error. Please try again in a moment.'
        : 'Request failed');

    throw new ApiError(message, response.status);
  }

  return response.json();
};

export const authApi = {
  login: async (password: string, rememberMe: boolean) => {
    const data = await request<{ token: string; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password, rememberMe }),
    });
    setToken(data.token, rememberMe);
    return data;
  },

  logout: async () => {
    await request('/auth/logout', { method: 'POST' });
    clearToken();
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

export const incomeApi = {
  getAll: (params: Record<string, string | number>) => {
    const query = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ).toString();
    return request<IncomeResponse>(`/income?${query}`);
  },

  getStats: () => request<IncomeStats>('/income/stats'),

  create: (data: Omit<Income, '_id' | 'createdAt'>) =>
    request<Income>('/income', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Omit<Income, '_id' | 'createdAt'>>) =>
    request<Income>(`/income/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<{ message: string }>(`/income/${id}`, { method: 'DELETE' }),
};

export const dashboardApi = {
  getStats: (month?: string) => {
    const query = month ? `?month=${encodeURIComponent(month)}` : '';
    return request<DashboardStats>(`/dashboard/stats${query}`);
  },
};

export const savingsApi = {
  getAll: (params: Record<string, string | number>) => {
    const query = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ).toString();
    return request<SavingsResponse>(`/savings?${query}`);
  },

  getStats: () => request<SavingsStats>('/savings/stats'),

  getGoal: () => request<{ monthlyGoal: number }>('/savings/goal'),

  updateGoal: (monthlyGoal: number) =>
    request<{ monthlyGoal: number }>('/savings/goal', {
      method: 'PUT',
      body: JSON.stringify({ monthlyGoal }),
    }),

  create: (data: Omit<SavingsEntry, '_id' | 'createdAt'>) =>
    request<SavingsEntry>('/savings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Omit<SavingsEntry, '_id' | 'createdAt'>>) =>
    request<SavingsEntry>(`/savings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<{ message: string }>(`/savings/${id}`, { method: 'DELETE' }),
};

export { ApiError };

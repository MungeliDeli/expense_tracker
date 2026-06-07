import { useState, useEffect, useCallback } from 'react';
import { expensesApi } from '../lib/api';
import type { Expense, ExpenseFilters, Pagination } from '../types';

const defaultFilters: ExpenseFilters = {
  search: '',
  category: 'all',
  startDate: '',
  endDate: '',
  sortBy: 'date',
  sortOrder: 'desc',
  page: 1,
  limit: 10,
};

export const useExpenses = (initialFilters?: Partial<ExpenseFilters>) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [filters, setFilters] = useState<ExpenseFilters>({ ...defaultFilters, ...initialFilters });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params: Record<string, string | number> = {
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        page: filters.page,
        limit: filters.limit,
      };
      if (filters.search) params.search = filters.search;
      if (filters.category !== 'all') params.category = filters.category;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const data = await expensesApi.getAll(params);
      setExpenses(data.expenses);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load expenses');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const updateFilters = (updates: Partial<ExpenseFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates, page: updates.page ?? 1 }));
  };

  return { expenses, pagination, filters, isLoading, error, updateFilters, refetch: fetchExpenses };
};

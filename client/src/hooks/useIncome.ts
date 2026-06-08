import { useState, useEffect, useCallback } from 'react';
import { incomeApi } from '../lib/api';
import type { Income, IncomeFilters, Pagination } from '../types';

const defaultFilters: IncomeFilters = {
  search: '',
  source: 'all',
  startDate: '',
  endDate: '',
  sortBy: 'date',
  sortOrder: 'desc',
  page: 1,
  limit: 10,
};

export const useIncome = (initialFilters?: Partial<IncomeFilters>) => {
  const [income, setIncome] = useState<Income[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [filters, setFilters] = useState<IncomeFilters>({ ...defaultFilters, ...initialFilters });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncome = useCallback(async () => {
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
      if (filters.source !== 'all') params.source = filters.source;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const data = await incomeApi.getAll(params);
      setIncome(data.income);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load income');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchIncome();
  }, [fetchIncome]);

  const updateFilters = (updates: Partial<IncomeFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates, page: updates.page ?? 1 }));
  };

  return { income, pagination, filters, isLoading, error, updateFilters, refetch: fetchIncome };
};

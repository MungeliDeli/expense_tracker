import { useState, useEffect, useCallback } from 'react';
import { savingsApi } from '../lib/api';
import type { SavingsEntry, SavingsFilters, Pagination } from '../types';

const defaultFilters: SavingsFilters = {
  search: '',
  type: 'all',
  startDate: '',
  endDate: '',
  sortBy: 'date',
  sortOrder: 'desc',
  page: 1,
  limit: 10,
};

export const useSavings = (initialFilters?: Partial<SavingsFilters>) => {
  const [savings, setSavings] = useState<SavingsEntry[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [filters, setFilters] = useState<SavingsFilters>({ ...defaultFilters, ...initialFilters });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSavings = useCallback(async () => {
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
      if (filters.type !== 'all') params.type = filters.type;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const data = await savingsApi.getAll(params);
      setSavings(data.savings);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load savings');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchSavings();
  }, [fetchSavings]);

  const updateFilters = (updates: Partial<SavingsFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates, page: updates.page ?? 1 }));
  };

  return { savings, pagination, filters, isLoading, error, updateFilters, refetch: fetchSavings };
};

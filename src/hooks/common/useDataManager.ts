import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { parseBaseQueryParams } from '@/lib/queryParams';

interface UseDataTableOptions<TRecord, TParams> {
  queryKey: string[];
  fetchFn: (params: TParams) => Promise<{ data: TRecord[]; meta: any }>;
  parseExtraParams?: (searchParams: URLSearchParams) => Partial<TParams>;
}

export function useDataTableQuery<TRecord, TParams>({
  queryKey,
  fetchFn,
  parseExtraParams,
}: UseDataTableOptions<TRecord, TParams>) {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = {
    ...parseBaseQueryParams(searchParams),
    ...(parseExtraParams ? parseExtraParams(searchParams) : {}),
  } as TParams;

  const query = useQuery({
    queryKey: [...queryKey, params],
    queryFn: () => fetchFn(params),
    placeholderData: (prev) => prev,
  });

  const setParams = useCallback((next: Partial<TParams>) => {
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);
      Object.entries(next).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          updated.set(key, String(value));
        } else {
          updated.delete(key);
        }
      });
      return updated;
    });
  }, [setSearchParams]);

  return {
    data: query.data?.data ?? [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    params,
    setParams,
    // Helpers para simplificar la vida a la DataTable
    onPaginationChange: (pagination: { pageIndex: number; pageSize: number }) => setParams({ page: pagination.pageIndex + 1, limit: pagination.pageSize } as any),
    onSortingChange: (sortBy: string, sortOrder: 'asc' | 'desc') => setParams({ sortBy, sortOrder } as any),
  };
}
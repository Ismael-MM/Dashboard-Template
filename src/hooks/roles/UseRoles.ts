import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { getRoles, type RolesParams } from '@/api/roles.api';

export const useRoles = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const params: RolesParams = {
    page: Number(searchParams.get('page') ?? 1),
    limit: Number(searchParams.get('limit') ?? 10),
    sortBy: searchParams.get('sortBy') ?? 'id',
    sortOrder: (searchParams.get('sortOrder') ?? 'desc') as 'asc' | 'desc',
    search: searchParams.get('search') ?? undefined,
    name: searchParams.get('name') ?? undefined,
  };

  const query = useQuery({
    queryKey: ['roles', params],
    queryFn: () => getRoles(params),
    placeholderData: (prev) => prev,
  });

  const setParams = useCallback((next: Partial<RolesParams>) => {
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);
      Object.entries(next).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          updated.set(key, String(value));
        } else {
          updated.delete(key);
        }
      });
      return updated;
    });
  }, [setSearchParams]);

  return {
    // datos
    data: query.data?.data ?? [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    // params actuales
    params,
    setParams,
    // callbacks para la tabla
    setPage: (pageIndex: number) => setParams({ page: pageIndex + 1 }),
    setLimit: (limit: number) => setParams({ limit, page: 1 }),
    setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => setParams({ sortBy, sortOrder }),
    setSearch: (search: string) => setParams({ search, page: 1 }),
  };
}
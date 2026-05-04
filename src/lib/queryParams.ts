import type { BaseQueryParams } from '@/types/common';

export function parseBaseQueryParams(searchParams: URLSearchParams): BaseQueryParams {
  return{
    page: Number(searchParams.get('page') ?? 1),
    limit: Number(searchParams.get('limit') ?? 10),
    sortBy: searchParams.get('sortBy') ?? 'id',
    sortOrder: (searchParams.get('sortOrder') ?? 'desc') as 'asc' | 'desc',
    search: searchParams.get('search') ?? undefined,
  };
}
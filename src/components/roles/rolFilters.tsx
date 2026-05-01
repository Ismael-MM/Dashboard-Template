import { Filter } from '@/components/data-table/filter';
import { useDebounce } from '@/hooks/useDebounce';
import { useEffect, useState } from 'react';
import type { RolesParams } from '@/types/roles';

interface RolesFiltersProps {
  params: RolesParams;
  setParams: (params: Partial<RolesParams>) => void;
}

export function RolesFilters({ params, setParams }: RolesFiltersProps) {
  const [searchValue, setSearchValue] = useState(params.search ?? '');
  const debouncedSearch = useDebounce(searchValue, 400)

  useEffect(() => {
    setParams({ search: debouncedSearch, page: 1 });
  }, [debouncedSearch, setParams]);

  return (
    <div className="flex flex-wrap items-end gap-4 px-6 py-4">
      <div className="flex flex-col gap-1.5 w-full sm:w-56">
        <label className='text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1'>
            Rol
        </label>
        <Filter
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={setSearchValue}
        />
      </div>
    </div>
  );
}
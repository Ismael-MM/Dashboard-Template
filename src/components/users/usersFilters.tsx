import { Filter } from '@/components/data-table/filter';
import type { RoleOption } from '@/types/roles';
import type { UsersParams } from '@/types/users';
import { useDebounce } from '@/hooks/useDebounce';
import { useEffect, useState } from 'react';

interface UsersFiltersProps {
  params: UsersParams;
  setParams: (params: Partial<UsersParams>) => void;
  roles: RoleOption[];
}

export function UsersFilters({ params, setParams, roles }: UsersFiltersProps) {
  const [searchValue, setSearchValue] = useState(params.search ?? '');
  const debouncedSearch = useDebounce(searchValue, 400)

  useEffect(() => {
    setParams({ search: debouncedSearch, page: 1 });
  }, [debouncedSearch, setParams]);

  return (
    <div className="flex flex-wrap items-end gap-4 px-6 py-4">
      <div className="flex flex-col gap-1.5 w-full sm:w-56">
        <label className='text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1'>
            Usuario
        </label>
        <Filter
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={setSearchValue}
        />
      </div>
      <div className="flex flex-col gap-1.5 w-full sm:w-44">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
          Rol
        </label>
        <Filter
          type="select"
          placeholder="All roles"
          value={params.roleId}
          onChange={(value) => setParams({ roleId: value, page: 1 })}
          options={roles.map((r) => ({ label: r.name, value: r.id }))}
        />
      </div>
    </div>
  );
}
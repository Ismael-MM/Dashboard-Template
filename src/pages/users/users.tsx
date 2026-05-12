"use client";

import { useMemo } from "react";
import {
  createUser,
  updateUser,
  deleteUser,
  getUsers,
} from "@/api/users.api";
import type { UserFormPayload, UserRecord, UsersParams } from '@/types/users';
import { DataTable } from "@/components/data-table/data-table";
import { UserFormSheet } from "@/components/users/user-form-sheet";
import { Pencil, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { UsersFilters } from '@/components/users/usersFilters';
import { getRolesDropdown } from '@/api/roles.api';
import { Badge } from '@/components/ui/badge';
import { useCrudManager } from '@/hooks/common/useCrudManager';
import { useDataTableQuery } from '@/hooks/common/useDataManager';
import { HasPermission } from '@/components/auth/HasPermission';
import { PermissionsEnum } from '@/types/permissions';
import { useCan } from '@/hooks/auth/UseCan';
import { DisabledActionButton } from '@/components/data-table/disabledActionButton';
import { ActionButton } from '@/components/data-table/actionButton';

export default function UsersPage() {
  const { can } = useCan();

  const { data, meta, isLoading, params, setParams, onPaginationChange, onSortingChange } = useDataTableQuery<UserRecord, UsersParams>({
    queryKey: ['users'],
    fetchFn: getUsers,
    parseExtraParams: (searchParams) => ({
      roleId: searchParams.get('roleId') ?? undefined,
      apellido: searchParams.get('apellido') ?? undefined,
      username: searchParams.get('username') ?? undefined,
      nombre: searchParams.get('nombre') ?? undefined,
    })
  });


  const {data: roles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: getRolesDropdown,
  })

  const { isOpen, mode, selectedItem, isSubmitting, error, actions } = useCrudManager<UserRecord, UserFormPayload, number>({
    queryKey: ['users'],
    createFn: createUser,
    updateFn: updateUser,
    deleteFn: deleteUser,
    getId: (user) => user.id
  })

  const columns = useMemo<ColumnDef<UserRecord>[]>(() => [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "username", header: "Username" },
    { accessorKey: "nombre", header: "Nombre" },
    { accessorKey: "apellido", header: "Apellido" },
    { accessorKey: "email", header: "Email" },
    {
      id: "roleId",
      header: "Rol",
      cell: ({ row }) => {
        const roleName = row.original.role?.name

        return roleName ? (
          <Badge className='bg-red-500'>{roleName}</Badge>
        ) : (
          <Badge className="text-xs text-white italic">Sin rol</Badge>
        );
      },
    },
  ], []);

  return (
    <>
      <div className="container mx-auto space-y-4 py-6 sm:space-y-5 sm:py-8 lg:py-10">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Users</h1>
          <p className="text-sm text-muted-foreground">Manage user records from the panel.</p>
        </div>

        <DataTable
          columns={columns}
          data={data}
          title="User Table"
          addLabel="New user"
          isLoading={isLoading}
          onAdd={can(PermissionsEnum.USERS_CREATE) ? actions.openCreate : undefined}
          pageCount={meta?.totalPages ?? 0}
          totalCount={meta?.total ?? 0}
          pagination={{
            pageIndex: (params.page ?? 1) - 1,
            pageSize: params.limit ?? 10,
          }}
          onPaginationChange={onPaginationChange}
          onSortingChange={onSortingChange}
          renderRowActions={(user) => (
            <div className="flex items-center gap-2">
              <HasPermission permission={PermissionsEnum.USERS_UPDATE}
                fallback={
                  <DisabledActionButton
                    icon={<Pencil className="h-4 w-4" />}
                    text="No tienes permisos para Editar usuarios"
                  />
                }
              >
                <ActionButton
                  icon={<Pencil className="h-4 w-4" />}
                  color='border-yellow-400 bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20 hover:text-yellow-600"'
                  tooltiptext='Editar Usuario'
                  tooltipkey='edit'
                  description={''}
                  item={user}
                  action={actions.openEdit}
                />
              </HasPermission>
              <HasPermission permission={PermissionsEnum.USERS_DELETE}
                fallback={
                  <DisabledActionButton
                    icon={<Trash2 className="h-4 w-4" />}
                    text="No tienes permisos para Borrar usuarios"
                  />
                }
              >
                <ActionButton
                  icon={<Trash2 className="h-4 w-4" />}
                  delete
                  tooltiptext='Borrar Usuario'
                  tooltipkey='Delete'
                  description={`Are you sure you want to delete ${user.username}? This action cannot be undone.`}
                  item={user}
                  action={actions.handleDelete}
                />
              </HasPermission>
            </div>
          )}
          renderFilters={
            <UsersFilters
              params={params}
              setParams={setParams}
              roles={roles}
            />
          }
        />
      </div>

      <UserFormSheet
        open={isOpen}
        mode={mode}
        roles={roles}
        user={selectedItem}
        isSubmitting={isSubmitting}
        submitError={error}
        onOpenChange={actions.handleOpenChange}
        onSubmit={actions.handleSubmit}
      />
    </>
  );
}

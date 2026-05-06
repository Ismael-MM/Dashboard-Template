"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { ConfirmDeleteDialog } from "@/components/ui/confirm_delete_dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { createRole, deleteRole, getRoles, updateRole } from '@/api/roles.api';
import type { RolePayload, RoleRecord, RolesParams } from '@/types/roles';
import { RolFormSheet } from '@/components/roles/rol-form';
import { RolesFilters } from '@/components/roles/rolFilters';
import { useCrudManager } from '@/hooks/common/useCrudManager';
import { useDataTableQuery } from '@/hooks/common/useDataManager';
import { PermissionBadges } from '@/components/permissions/permission-badged';
import { getPermissionsDropdown } from '@/api/permissions.api';
import { useQuery } from '@tanstack/react-query';

export default function RolesPage() {
  const { data, meta, isLoading, params, setParams, onPaginationChange, onSortingChange } = useDataTableQuery<RoleRecord, RolesParams>({
    queryKey: ['roles'],
    fetchFn: getRoles,
    parseExtraParams: (searchParams) => ({
      name: searchParams.get('name') ?? undefined
    })
  });

  const { isOpen, mode, selectedItem, isSubmitting, error, actions } = useCrudManager<RoleRecord, RolePayload, string>({
    queryKey: ['roles'],
    createFn: createRole,
    updateFn: updateRole,
    deleteFn: deleteRole,
    getId: (role) => role.id
  })

  const {data: permisos = [] } = useQuery({
    queryKey: ['permissions'],
    queryFn: getPermissionsDropdown,
  })

  const columns = useMemo<ColumnDef<RoleRecord>[]>(() => [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "name" },
    { accessorKey: "permissions", header: "permisos",
      cell: ({row}) => {
        const permisosArray = row.original?.permissions ?? [];
        return(
          <PermissionBadges
            permissions={permisosArray}
          />
        );

      }
    }
  ], []);

  console.log(meta)

  return (
    <>
      <div className="container mx-auto space-y-4 py-6 sm:space-y-5 sm:py-8 lg:py-10">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Roles</h1>
          <p className="text-sm text-muted-foreground">Manage roles records from the panel.</p>
        </div>

        <DataTable
          columns={columns}
          data={data}
          title="Rol Table"
          addLabel="New Rol"
          isLoading={isLoading}
          onAdd={actions.openCreate}
          pageCount={meta?.totalPages ?? 0}
          totalCount={meta?.total ?? 0}
          pagination={{
            pageIndex: (params.page ?? 1) - 1,
            pageSize: params.limit ?? 10,
          }}
          onPaginationChange={onPaginationChange}
          onSortingChange={onSortingChange}
          renderRowActions={(role) => (
            <div className="flex items-center gap-2">
              <Tooltip key='edit'>
                <TooltipTrigger asChild>
                  <Button
                    size="icon-sm"
                    variant="outline"
                    className="border-yellow-400 bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20 hover:text-yellow-600"
                    onClick={() => actions.openEdit(role)}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit rol</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='top'>
                  <p className='text-sm'>Editar rol</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip key='delete'>
                <TooltipTrigger asChild>
                  <div>
                    <ConfirmDeleteDialog
                      title="Delete Rol"
                      description={`Are you sure you want to delete ${role.name}? This action cannot be undone.`}
                      onConfirm={() => actions.handleDelete(role)}
                      trigger={(
                            <Button
                              size="icon-sm"
                              variant="outline"
                              className="border-red-400 bg-red-500/10 text-red-700 hover:bg-red-500/20 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>

                      )}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side='top'>
                  <p className='text-sm'>Borrar Rol</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
          renderFilters={
            <RolesFilters
              params={params}
              setParams={setParams}
            />
          }
        />
      </div>

      <RolFormSheet
        open={isOpen}
        mode={mode}
        rol={selectedItem}
        permissions={permisos}
        permissionsSeleted={selectedItem?.permissions}
        isSubmitting={isSubmitting}
        submitError={error}
        onOpenChange={actions.handleOpenChange}
        onSubmit={actions.handleSubmit}
      />
    </>
  );
}

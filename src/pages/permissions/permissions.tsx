"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { ConfirmDeleteDialog } from "@/components/ui/confirm_delete_dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { RolesFilters } from '@/components/roles/rolFilters';
import { useCrudManager } from '@/hooks/common/useCrudManager';
import { createPermission, deletePermission, getPermission, updatePermission } from '@/api/permissions.api';
import type { PermissionPayload, PermissionRecord, PermissionsParams } from '@/types/permissions';
import { useDataTableQuery } from '@/hooks/common/useDataManager';
import { PermissionFormSheet } from '@/components/permissions/permission-form';

export default function PermissionsPage() {
  const { data, meta, isLoading, params, setParams, onPaginationChange, onSortingChange } = useDataTableQuery<PermissionRecord, PermissionsParams>({
    queryKey: ['permissions'],
    fetchFn: getPermission,
    parseExtraParams: (searchParams) => ({
      name: searchParams.get('name') ?? undefined,
      label: searchParams.get('label') ?? undefined,
      group: searchParams.get('group') ?? undefined,
    })
  });

  const { isOpen, mode, selectedItem, isSubmitting, error, actions } = useCrudManager<PermissionRecord, PermissionPayload, string>({
    queryKey: ['permissions'],
    createFn: createPermission,
    updateFn: updatePermission,
    deleteFn: deletePermission,
    getId: (permission) => permission.id
  })

  const columns = useMemo<ColumnDef<PermissionRecord>[]>(() => [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "name" },
    { accessorKey: "label", header: "Label" },
    { accessorKey: "group", header: "group" },
  ], []);

  return (
    <>
      <div className="container mx-auto space-y-4 py-6 sm:space-y-5 sm:py-8 lg:py-10">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Permisos</h1>
          <p className="text-sm text-muted-foreground">Manage permisos records from the panel.</p>
        </div>

        <DataTable
          columns={columns}
          data={data}
          title="Permiso Table"
          addLabel="Crear permiso"
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
          renderRowActions={(permission) => (
            <div className="flex items-center gap-2">
              <Tooltip key='edit'>
                <TooltipTrigger asChild>
                  <Button
                    size="icon-sm"
                    variant="outline"
                    className="border-yellow-400 bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20 hover:text-yellow-600"
                    onClick={() => actions.openEdit(permission)}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit permiso</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='top'>
                  <p className='text-sm'>Editar permiso</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip key='delete'>
                <TooltipTrigger asChild>
                  <div>
                    <ConfirmDeleteDialog
                      title="Delete Rol"
                      description={`Are you sure you want to delete ${permission.name}? This action cannot be undone.`}
                      onConfirm={() => actions.handleDelete(permission)}
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
                  <p className='text-sm'>Borrar permiso</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
          renderFilters={
            <></>
          }
        />
      </div>

      <PermissionFormSheet
        open={isOpen}
        mode={mode}
        permission={selectedItem}
        isSubmitting={isSubmitting}
        submitError={error}
        onOpenChange={actions.handleOpenChange}
        onSubmit={actions.handleSubmit}
      />
    </>
  );
}

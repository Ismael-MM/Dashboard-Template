"use client";

import { useMemo, useState } from "react";
import { AxiosError } from "axios";

import {
  createUser,
  updateUser,
  deleteUser,
} from "@/api/users.api";
import type { UserFormPayload, UserRecord } from '@/types/users';
import { useUsers } from '@/hooks/users/UseUsers';
import { DataTable } from "@/components/data-table/data-table";
import { UserFormSheet } from "@/components/users/user-form-sheet";
import { ConfirmDeleteDialog } from "@/components/ui/confirm_delete_dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { UsersFilters } from '@/components/users/usersFilters';
import { getRolesDropdown } from '@/api/roles.api';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { useCrudManager } from '@/hooks/common/useCrudManager';

export default function UsersPage() {
  const { data, meta, isLoading, params, setParams, setSort } = useUsers();


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
          onAdd={actions.openCreate}
          pageCount={meta?.totalPages ?? 0}
          pagination={{
            pageIndex: (params.page ?? 1) - 1,
            pageSize: params.limit ?? 10,
          }}
          onPaginationChange={({ pageIndex, pageSize }) => {
            setParams({ page: pageIndex + 1, limit: pageSize })
          }}
          onSortingChange={setSort}
          renderRowActions={(user) => (
            <div className="flex items-center gap-2">
              <Tooltip key='edit'>
                <TooltipTrigger asChild>
                  <Button
                    size="icon-sm"
                    variant="outline"
                    className="border-yellow-400 bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20 hover:text-yellow-600"
                    onClick={() => actions.openEdit(user)}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit user</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='top'>
                  <p className='text-sm'>Editar Usuario</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip key='delete'>
                <TooltipTrigger asChild>
                  <div>
                    <ConfirmDeleteDialog
                      title="Delete user"
                      description={`Are you sure you want to delete ${user.username}? This action cannot be undone.`}
                      onConfirm={() => actions.handleDelete(user)}
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
                  <p className='text-sm'>Borrar Usuario</p>
                </TooltipContent>
              </Tooltip>
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

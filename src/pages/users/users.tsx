"use client";

import { useMemo, useState } from "react";
import { AxiosError } from "axios";

import {
  createUser,
  updateUser,
  deleteUser,
  type UserFormPayload,
  type UserRecord,
} from "@/api/users.api";
import { useUsers } from '@/hooks/users/UseUsers';
import { DataTable } from "@/components/data-table/data-table";
import { UserFormSheet } from "@/components/users/user-form-sheet";
import { ConfirmDeleteDialog } from "@/components/ui/confirm_delete_dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { UsersFilters } from '@/components/users/usersFilters';
import { getRolesDropdown } from '@/api/roles.api';

type FormMode = "create" | "edit";

export default function UsersPage() {
  const queryClient = useQueryClient();
  const { data, meta, isLoading, params, setParams, setSort } = useUsers();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {data: roles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: getRolesDropdown,
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
          <div className="font-medium text-slate-700">{roleName}</div>
        ) : (
          <span className="text-xs text-muted-foreground italic">Sin rol</span>
        );
      },
    },
  ], []);

  const openCreate = () => {
    setFormMode("create");
    setSelectedUser(null);
    setSubmitError(null);
    setIsSheetOpen(true);
  };

  const openEdit = (user: UserRecord) => {
    setFormMode("edit");
    setSelectedUser(user);
    setSubmitError(null);
    setIsSheetOpen(true);
  };

  const handleSheetChange = (open: boolean) => {
    setIsSheetOpen(open);
    if (!open) {
      setSubmitError(null);
      setSelectedUser(null);
    }
  };

  const handleSubmit = async (payload: UserFormPayload) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      if (formMode === "create") {
        await createUser(payload);
      } else if (selectedUser) {
        await updateUser(selectedUser.id, payload);
      }

      // Invalida la query para que refetchee automáticamente
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsSheetOpen(false);
    } catch (error: unknown) {
      const message = error instanceof AxiosError ? error.response?.data?.message : null;
      setSubmitError(
        Array.isArray(message)
          ? message.join(", ")
          : typeof message === "string"
            ? message
            : "The user could not be saved. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (userId: number) => {
    
    try {
      await deleteUser(userId);
      await queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (error) {
      console.error("Error deleting user:", error);
    }

  };

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
          onAdd={openCreate}
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
              <Button
                size="icon-sm"
                variant="outline"
                className="border-yellow-400 bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20 hover:text-yellow-600"
                onClick={() => openEdit(user)}
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit user</span>
              </Button>
              <ConfirmDeleteDialog
                title="Delete user"
                description={`Are you sure you want to delete ${user.username}? This action cannot be undone.`}
                onConfirm={() => handleDelete(user.id)}
                trigger={(
                  <Button
                    size="icon-sm"
                    variant="outline"
                    className="border-red-400 bg-red-500/10 text-red-700 hover:bg-red-500/20 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete user</span>
                  </Button>
                )}
              />
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
        open={isSheetOpen}
        mode={formMode}
        roles={roles}
        user={selectedUser}
        isSubmitting={isSubmitting}
        submitError={submitError}
        onOpenChange={handleSheetChange}
        onSubmit={handleSubmit}
      />
    </>
  );
}

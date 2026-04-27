// pages/users/UsersPage.tsx
"use client";

import { useMemo, useState } from "react";
import { AxiosError } from "axios";

import { createUser, getRoles, updateUser, type UserFormPayload, type UserRecord } from "@/api/users.api";
import { useUsers } from '@/hooks/users/UseUsers';
import { DataTable } from "@/components/data-table/data-table";
import { UserFormSheet } from "@/components/users/user-form-sheet";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";

type FormMode = "create" | "edit";

export default function UsersPage() {
  const queryClient = useQueryClient();
  const { data, meta, isLoading, params, setPage, setLimit, setSort } = useUsers();

  // Roles con TanStack Query también
  const { data: roles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  });

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const columns = useMemo<ColumnDef<UserRecord>[]>(() => [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "username", header: "Username" },
    { accessorKey: "nombre", header: "Nombre" },
    { accessorKey: "apellido", header: "Apellido" },
    { accessorKey: "email", header: "Email" },
    {
      id: "role",
      header: "Rol",
      cell: ({ row }) => row.original.role?.name ?? "Sin rol",
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
            setPage(pageIndex);
            setLimit(pageSize);
          }}
          onSortingChange={setSort}
          renderRowActions={(user) => (
            <Button
              size="icon-sm"
              variant="outline"
              className="border-yellow-400 bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20"
              onClick={() => openEdit(user)}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit user</span>
            </Button>
          )}
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
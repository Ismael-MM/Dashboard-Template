"use client";

import { useMemo, useState } from "react";
import { AxiosError } from "axios";
import { DataTable } from "@/components/data-table/data-table";
import { ConfirmDeleteDialog } from "@/components/ui/confirm_delete_dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { createRole, deleteRole, updateRole } from '@/api/roles.api';
import type { RolePayload, RoleRecord } from '@/types/roles';
import { useRoles } from '@/hooks/roles/UseRoles';
import { RolFormSheet } from '@/components/roles/rol-form';
import { RolesFilters } from '@/components/roles/rolFilters';

type FormMode = "create" | "edit";

export default function RolesPage() {
  const queryClient = useQueryClient();
  const { data, meta, isLoading, params, setParams, setSort } = useRoles();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [selectedRole, setSelectedRole] = useState<RoleRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const columns = useMemo<ColumnDef<RoleRecord>[]>(() => [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "name" },
  ], []);

  const openCreate = () => {
    setFormMode("create");
    setSelectedRole(null);
    setSubmitError(null);
    setIsSheetOpen(true);
  };

  const openEdit = (role: RoleRecord) => {
    setFormMode("edit");
    setSelectedRole(role);
    setSubmitError(null);
    setIsSheetOpen(true);
  };

  const handleSheetChange = (open: boolean) => {
    setIsSheetOpen(open);
    if (!open) {
      setSubmitError(null);
      setSelectedRole(null);
    }
  };

  const handleSubmit = async (payload: RolePayload) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      if (formMode === "create") {
        await createRole(payload);
      } else if (selectedRole) {
        await updateRole(selectedRole.id, payload);
      }

      // Invalida la query para que refetchee automáticamente
      queryClient.invalidateQueries({ queryKey: ['roles'], exact: false });
      
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

  const handleDelete = async (roleId: string) => {
    
    try {
      await deleteRole(roleId);
      await queryClient.invalidateQueries({ queryKey: ['roles'], exact: false });
    } catch (error) {
      console.error("Error deleting rol:", error);
    }

  };

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
          renderRowActions={(role) => (
            <div className="flex items-center gap-2">
              <Tooltip key='edit'>
                <TooltipTrigger asChild>
                  <Button
                    size="icon-sm"
                    variant="outline"
                    className="border-yellow-400 bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20 hover:text-yellow-600"
                    onClick={() => openEdit(role)}
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
                      description={`Are you sure you want to delete ${role.username}? This action cannot be undone.`}
                      onConfirm={() => handleDelete(role.id)}
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
        open={isSheetOpen}
        mode={formMode}
        rol={selectedRole}
        isSubmitting={isSubmitting}
        submitError={submitError}
        onOpenChange={handleSheetChange}
        onSubmit={handleSubmit}
      />
    </>
  );
}

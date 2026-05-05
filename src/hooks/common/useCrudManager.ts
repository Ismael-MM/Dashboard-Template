import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';


interface CrudOptions<TRecord, TPayload, TId extends string | number = number> {
  queryKey: string[];
  createFn: (payload: TPayload) => Promise<any>;
  updateFn: (id: TId, payload: TPayload) => Promise<any>;
  deleteFn: (id: TId) => Promise<any>
  getId: (record: TRecord) => TId;
}

export function useCrudManager<TRecord, TPayload, TId extends string | number = number>({
  queryKey,
  createFn,
  updateFn,
  deleteFn,
  getId,
}: CrudOptions<TRecord,TPayload,TId>) {
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedItem, setSelectedItem] = useState<TRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openCreate = () => {
  setMode("create");
  setSelectedItem(null);
  setError(null);
  setIsOpen(true);
};

  const openEdit = (item: TRecord) => {
    setMode("edit");
    setSelectedItem(item);
    setError(null);
    setIsOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setError(null);
      setSelectedItem(null);
    }
  };

  const handleSubmit = async (payload: TPayload) => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (mode === "create") {
        await createFn(payload);
      } else if (selectedItem) {
        await updateFn(getId(selectedItem), payload);
      }

      // Invalida la query para que refetchee automáticamente
      queryClient.invalidateQueries({ queryKey, exact: false });
      setIsOpen(false);
    } catch (error: unknown) {
      const message = error instanceof AxiosError ? error.response?.data?.message : null;
      setError(
        Array.isArray(message)
          ? message.join(", ")
          : typeof message === "string"
            ? message
            : "Ha ocurrido un error. Inténtalo de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (item: TRecord) => {

    try {
      await deleteFn(getId(item));
      queryClient.invalidateQueries({ queryKey, exact: false });
    } catch (error) {
      console.error("Error al borrar:", error);
    }

  };

  return {
    isOpen,
    mode,
    selectedItem,
    isSubmitting,
    error,
    actions: {
      openCreate,
      openEdit,
      handleOpenChange,
      handleSubmit,
      handleDelete,
    },
  };
};

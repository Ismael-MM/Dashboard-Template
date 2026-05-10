import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { RolePayload, RoleRecord } from '@/types/roles';
import type { PermissionOption } from '@/types/permissions';
import { PermissionSelector } from '../permissions/permission-selector';

type FormMode = "create" | "edit";

// ← Schema
const roleSchema = z.object({
  name: z.string().min(1, "Name is required."),
  permissions: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof roleSchema>;

const emptyFields: FormValues = {
  name: "",
  permissions: [],
};

interface RolFormSheetProps {
  open: boolean;
  mode: FormMode;
  rol?: RoleRecord | null;
  permissions?: PermissionOption[] | null;
  isSubmitting?: boolean;
  submitError?: string | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: RolePayload) => Promise<void>;
}

export function RolFormSheet({
  open, mode, rol, permissions, isSubmitting = false, submitError, onOpenChange, onSubmit,
}: RolFormSheetProps) {

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: emptyFields,
  });

  useEffect(() => {
    if (open) {
      reset(rol ? {
        name: rol.name,
        permissions: rol.permissions?.map((p: PermissionOption) => p.name) ?? [],
      } : emptyFields);
    }
  }, [open, rol, mode, reset]);

  const title = mode === "create" ? "Create rol" : "Edit rol";
  const description = mode === "create"
    ? "Fill out the new rol's details before saving."
    : "Update the necessary fields.";

  const onFormSubmit = async (values: FormValues) => {
    await onSubmit({
      name: values.name.trim(),
      permissions: values.permissions ?? [],
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0">
        <DialogHeader className="border-b">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col max-h-[92vh] sm:max-h-[85vh] w-full min-h-0">
          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5 min-h-0 pb-20 sm:pb-24">
            <FieldGroup>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="name">Nombre</FieldLabel>
                  <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
                  <FieldError>{errors.name?.message}</FieldError>
                </Field>
              </div>

              <div>
                <Controller
                  control={control}
                  name="permissions"
                  render={({ field }) => (
                    <PermissionSelector
                      permissions={permissions ?? []}
                      selectedPermissions={field.value ?? []}
                      onPermissionsChange={field.onChange}
                    />
                  )}
                />
              </div>

              {submitError ? <FieldError>{submitError}</FieldError> : null}
            </FieldGroup>
          </div>

          <DialogFooter className="sticky bottom-0 z-10 border-t bg-white/60 backdrop-blur-sm dark:bg-slate-900/60">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : mode === "create" ? "Create rol" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
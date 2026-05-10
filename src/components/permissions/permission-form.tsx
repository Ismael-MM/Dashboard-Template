import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { PermissionPayload, PermissionRecord } from '@/types/permissions';

type FormMode = "create" | "edit";

// ← Schema
const permissionSchema = z.object({
  name: z.string().min(1, "Name is required."),
  label: z.string().min(1, "Label is required."),
  group: z.string().min(1, "Group is required."),
});

type FormValues = z.infer<typeof permissionSchema>;

const emptyFields: FormValues = {
  name: "",
  label: "",
  group: "",
};

interface PermissionFormSheetProps {
  open: boolean;
  mode: FormMode;
  permission?: PermissionRecord | null;
  isSubmitting?: boolean;
  submitError?: string | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: PermissionPayload) => Promise<void>;
}

export function PermissionFormSheet({
  open, mode, permission, isSubmitting = false, submitError, onOpenChange, onSubmit,
}: PermissionFormSheetProps) {

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(permissionSchema),
    defaultValues: emptyFields,
  });

  useEffect(() => {
    if (open) {
      reset(permission ? {
        name: permission.name,
        label: permission.label,
        group: permission.group,
      } : emptyFields);
    }
  }, [open, permission, mode, reset]);

  const title = mode === "create" ? "Create permission" : "Edit permission";
  const description = mode === "create"
    ? "Fill out the new permission's details before saving."
    : "Update the necessary fields.";

  const onFormSubmit = async (values: FormValues) => {
    await onSubmit({
      name: values.name.trim(),
      label: values.label.trim(),
      group: values.group.trim(),
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

              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
                <FieldError>{errors.name?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="label">Label</FieldLabel>
                <Input id="label" {...register("label")} aria-invalid={!!errors.label} />
                <FieldError>{errors.label?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="group">Group</FieldLabel>
                <Input id="group" {...register("group")} aria-invalid={!!errors.group} />
                <FieldError>{errors.group?.message}</FieldError>
              </Field>

              {submitError ? <FieldError>{submitError}</FieldError> : null}
            </FieldGroup>
          </div>

          <DialogFooter className="sticky bottom-0 z-10 border-t bg-white/60 backdrop-blur-sm dark:bg-slate-900/60">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : mode === "create" ? "Create permission" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
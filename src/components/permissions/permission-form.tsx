import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PermissionPayload, PermissionRecord } from '@/types/permissions';

type FormMode = "create" | "edit";

type FormValues = {
  name: string;
  label: string;
  group: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

interface PermissionFormSheetProps {
  open: boolean;
  mode: FormMode;
  permission: PermissionRecord | null,
  isSubmitting?: boolean;
  submitError?: string | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: PermissionPayload) => Promise<void>;
}

const emptyValues: FormValues = {
  name: "",
  group: "",
  label: "",
};

const getInitialValues = (permission?: PermissionRecord | null): FormValues => ({
  name: permission?.name ?? "",
  group: permission?.group ?? "",
  label: permission?.label ?? "",
});

export function PermissionFormSheet({
  open,
  mode,
  permission,
  isSubmitting = false,
  submitError,
  onOpenChange,
  onSubmit,
}: PermissionFormSheetProps) {
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (open) {
      setValues(getInitialValues(permission));
      setErrors({});
    }
  }, [open, permission, mode]);

  const title = mode === "create" ? "Create rol" : "Edit rol";
  const description = useMemo(() => {
    if (mode === "create") {
      return "Fill out the new rol's details before saving.";
    }

    return "Update the necessary fields. Password is optional when editing.";
  }, [mode]);

  const updateValue = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!values.name.trim()) nextErrors.name = "First name is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const payload: PermissionPayload = {
      name: values.name,
      group: values.name,
      label: values.name,
    };

    await onSubmit(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0">
        <DialogHeader className="border-b">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col max-h-[92vh] sm:max-h-[85vh] w-full min-h-0"
        >
          {/* add bottom padding so the sticky footer doesn't overlap inputs */}
          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5 min-h-0 pb-20 sm:pb-24">
            <FieldGroup>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="name">Nombre</FieldLabel>
                  <Input
                    id="name"
                    value={values.name}
                    onChange={(event) => updateValue("name", event.target.value)}
                    aria-invalid={!!errors.name}
                  />
                  <FieldError>{errors.name}</FieldError>
                </Field>
              </div>
              {submitError ? <FieldError>{submitError}</FieldError> : null}
            </FieldGroup>
          </div>

          <DialogFooter className="sticky bottom-0 z-10 border-t bg-white/60 backdrop-blur-sm dark:bg-slate-900/60">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : mode === "create"
                  ? "Create rol"
                  : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

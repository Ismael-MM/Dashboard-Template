import { useEffect, useMemo, useState, type FormEvent } from "react";

import type { UserFormPayload, UserRecord } from "@/api/users.api";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { RoleOption } from '@/api/roles.api';

type FormMode = "create" | "edit";

type FormValues = {
  email: string;
  username: string;
  nombre: string;
  apellido: string;
  password: string;
  passwordConfirm: string;
  roleId: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

interface UserFormSheetProps {
  open: boolean;
  mode: FormMode;
  roles: RoleOption[];
  user?: UserRecord | null;
  isSubmitting?: boolean;
  submitError?: string | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: UserFormPayload) => Promise<void>;
}

const emptyValues: FormValues = {
  email: "",
  username: "",
  nombre: "",
  apellido: "",
  password: "",
  passwordConfirm: "",
  roleId: "",
};

const getInitialValues = (user?: UserRecord | null): FormValues => ({
  email: user?.email ?? "",
  username: user?.username ?? "",
  nombre: user?.nombre ?? "",
  apellido: user?.apellido ?? "",
  password: "",
  passwordConfirm: "",
  roleId: user?.roleId ?? user?.role?.id ?? "",
});

export function UserFormSheet({
  open,
  mode,
  roles,
  user,
  isSubmitting = false,
  submitError,
  onOpenChange,
  onSubmit,
}: UserFormSheetProps) {
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (open) {
      setValues(getInitialValues(user));
      setErrors({});
    }
  }, [open, user, mode]);

  const title = mode === "create" ? "Create user" : "Edit user";
  const description = useMemo(() => {
    if (mode === "create") {
      return "Fill out the new user's details before saving.";
    }

    return "Update the necessary fields. Password is optional when editing.";
  }, [mode]);

  const updateValue = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!values.nombre.trim()) nextErrors.nombre = "First name is required.";
    if (!values.apellido.trim()) nextErrors.apellido = "Last name is required.";
    if (!values.username.trim()) nextErrors.username = "Username is required.";
    if (!values.email.trim()) nextErrors.email = "Email is required.";
    if (values.email && !/\S+@\S+\.\S+/.test(values.email)) {
      nextErrors.email = "Enter a valid email.";
    }

    const shouldValidatePassword = mode === "create" || values.password.length > 0;

    if (mode === "create" && !values.password) {
      nextErrors.password = "Password is required.";
    }

    if (shouldValidatePassword && values.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    if (shouldValidatePassword && !values.passwordConfirm) {
      nextErrors.passwordConfirm = "Confirm the password.";
    }

    if (
      shouldValidatePassword &&
      values.passwordConfirm &&
      values.password !== values.passwordConfirm
    ) {
      nextErrors.passwordConfirm = "Passwords do not match.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const payload: UserFormPayload = {
      email: values.email.trim(),
      username: values.username.trim(),
      nombre: values.nombre.trim(),
      apellido: values.apellido.trim(),
    };

    if (values.roleId) {
      payload.roleId = values.roleId;
    }
    if (mode === "create" || values.password.trim()) {
      payload.password = values.password;
      payload.passwordConfirm = values.passwordConfirm;
    }

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
                  <FieldLabel htmlFor="nombre">First name</FieldLabel>
                  <Input
                    id="nombre"
                    value={values.nombre}
                    onChange={(event) => updateValue("nombre", event.target.value)}
                    aria-invalid={!!errors.nombre}
                  />
                  <FieldError>{errors.nombre}</FieldError>
                </Field>
                <Field>
                  <FieldLabel htmlFor="apellido">Last name</FieldLabel>
                  <Input
                    id="apellido"
                    value={values.apellido}
                    onChange={(event) => updateValue("apellido", event.target.value)}
                    aria-invalid={!!errors.apellido}
                  />
                  <FieldError>{errors.apellido}</FieldError>
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  value={values.username}
                  autoComplete='new-username'
                  onChange={(event) => updateValue("username", event.target.value)}
                  aria-invalid={!!errors.username}
                />
                <FieldError>{errors.username}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={values.email}
                  onChange={(event) => updateValue("email", event.target.value)}
                  aria-invalid={!!errors.email}
                />
                <FieldError>{errors.email}</FieldError>
              </Field>

              <Field>
                <FieldLabel>Role</FieldLabel>
                <Select
                  value={values.roleId || "none"}
                  onValueChange={(value) => updateValue("roleId", value === "none" ? "" : value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No role</SelectItem>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>This field is optional.</FieldDescription>
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="password">
                    {mode === "create" ? "Password" : "New password"}
                  </FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    value={values.password}
                    autoComplete='new-password'
                    onChange={(event) => updateValue("password", event.target.value)}
                    aria-invalid={!!errors.password}
                  />
                  <FieldDescription>
                    {mode === "create"
                      ? "Must be at least 6 characters."
                      : "Leave blank if you don't want to change it."}
                  </FieldDescription>
                  <FieldError>{errors.password}</FieldError>
                </Field>
                <Field>
                  <FieldLabel htmlFor="passwordConfirm">Confirm password</FieldLabel>
                  <Input
                    id="passwordConfirm"
                    type="password"
                    value={values.passwordConfirm}
                    autoComplete='new-password'
                    onChange={(event) =>
                      updateValue("passwordConfirm", event.target.value)
                    }
                    aria-invalid={!!errors.passwordConfirm}
                  />
                  <FieldError>{errors.passwordConfirm}</FieldError>
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
                  ? "Create user"
                  : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

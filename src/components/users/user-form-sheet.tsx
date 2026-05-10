import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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

import type { RoleOption } from '@/types/roles';
import type { UserFormPayload, UserRecord } from '@/types/users';

type FormMode = "create" | "edit";


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

// ← Schema — fuente de verdad
const userSchema = z.object({
  nombre: z.string().min(1, "First name is required."),
  apellido: z.string().min(1, "Last name is required."),
  username: z.string().min(1, "Username is required."),
  email: z.string().min(1, "Email is required.").email("Enter a valid email."),
  roleId: z.string().optional(),
  password: z.string().optional(),
  passwordConfirm: z.string().optional(),
}).refine(
  (data) => !data.password || data.password === data.passwordConfirm,
  { message: "Passwords do not match.", path: ["passwordConfirm"] }
);

// ← Tipo inferido del schema, no escrito a mano
type FormValues = z.infer<typeof userSchema>;

// ← Campos vacíos — una sola vez
const emptyFields: FormValues = {
  nombre: "", apellido: "", username: "", email: "",
  roleId: "", password: "", passwordConfirm: "",
};

export function UserFormSheet({ open, mode, user, roles, isSubmitting, submitError, onOpenChange, onSubmit }: UserFormSheetProps) {

  const title = mode === "create" ? "Create user" : "Edit user";
  const description = mode === "create"
    ? "Fill out the new user's details before saving."
    : "Update the necessary fields. Password is optional when editing.";

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: emptyFields,
  });

  useEffect(() => {
  if (open) {
    reset(user ? {
      ...emptyFields,
      nombre: user.nombre,
      apellido: user.apellido,
      username: user.username,
      email: user.email,
      roleId: user.roleId ?? user.role?.id ?? '',  // ← null → ''
      password: '',
      passwordConfirm: '',
    } : emptyFields);
  }
}, [open, user, mode, reset]);

  const onFormSubmit = async (values: FormValues) => {
    await onSubmit({
      ...values,
      // limpia password si está vacío en modo edit
      password: values.password || undefined,
      passwordConfirm: values.passwordConfirm || undefined,
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
                  <FieldLabel htmlFor="nombre">First name</FieldLabel>
                  <Input id="nombre" {...register("nombre")} aria-invalid={!!errors.nombre} />
                  <FieldError>{errors.nombre?.message}</FieldError>
                </Field>
                <Field>
                  <FieldLabel htmlFor="apellido">Last name</FieldLabel>
                  <Input id="apellido" {...register("apellido")} aria-invalid={!!errors.apellido} />
                  <FieldError>{errors.apellido?.message}</FieldError>
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input id="username" autoComplete="new-username" {...register("username")} aria-invalid={!!errors.username} />
                <FieldError>{errors.username?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="email" {...register("email")} aria-invalid={!!errors.email} />
                <FieldError>{errors.email?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel>Role</FieldLabel>
                <Controller
                  control={control}
                  name="roleId"
                  render={({ field }) => (
                    <Select
                      value={field.value || "none"}
                      onValueChange={(val) => field.onChange(val === "none" ? "" : val)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No role</SelectItem>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldDescription>This field is optional.</FieldDescription>
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="password">
                    {mode === "create" ? "Password" : "New password"}
                  </FieldLabel>
                  <Input id="password" type="password" autoComplete="new-password" {...register("password")} aria-invalid={!!errors.password} />
                  <FieldDescription>
                    {mode === "create" ? "Must be at least 6 characters." : "Leave blank if you don't want to change it."}
                  </FieldDescription>
                  <FieldError>{errors.password?.message}</FieldError>
                </Field>
                <Field>
                  <FieldLabel htmlFor="passwordConfirm">Confirm password</FieldLabel>
                  <Input id="passwordConfirm" type="password" autoComplete="new-password" {...register("passwordConfirm")} aria-invalid={!!errors.passwordConfirm} />
                  <FieldError>{errors.passwordConfirm?.message}</FieldError>
                </Field>
              </div>

              {submitError ? <FieldError>{submitError}</FieldError> : null}
            </FieldGroup>
          </div>

          <DialogFooter className="sticky bottom-0 z-10 border-t bg-white/60 backdrop-blur-sm dark:bg-slate-900/60">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : mode === "create" ? "Create user" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useState, type ComponentProps, type FormEvent } from "react"
import { AxiosError } from "axios"
import { useNavigate, Link } from "react-router-dom"

import { registerUser } from "@/api/auth.api"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function SignupForm({
  className,
  ...props
}: ComponentProps<"div">) {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (form.password !== form.passwordConfirm) {
      setError("Las contraseñas no coinciden.")
      return
    }

    try {
      setIsSubmitting(true)
      await registerUser({
        email: form.email.trim(),
        username: form.username.trim(),
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        password: form.password,
        passwordConfirm: form.passwordConfirm,
      })
      navigate("/login", { replace: true })
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? err.response?.data?.message
          : null

      setError(
        Array.isArray(message)
          ? message.join(", ")
          : typeof message === "string"
            ? message
            : "No se pudo completar el registro."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
          {error && (
            <p className="text-sm font-medium text-destructive mt-2 text-center bg-destructive/10 p-2 rounded">
              {error}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="nombre">Nombre</FieldLabel>
                  <Input
                    id="nombre"
                    type="text"
                    placeholder="John"
                    value={form.nombre}
                    onChange={(event) => updateField("nombre", event.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="apellido">Apellido</FieldLabel>
                  <Input
                    id="apellido"
                    type="text"
                    placeholder="Doe"
                    value={form.apellido}
                    onChange={(event) => updateField("apellido", event.target.value)}
                    required
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  value={form.username}
                  onChange={(event) => updateField("username", event.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  required
                />
              </Field>
              <Field>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      value={form.password}
                      onChange={(event) => updateField("password", event.target.value)}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={form.passwordConfirm}
                      onChange={(event) => updateField("passwordConfirm", event.target.value)}
                      required
                    />
                  </Field>
                </div>
                <FieldDescription>
                  Must be at least 6 characters long.
                </FieldDescription>
              </Field>
              <Field>
                {error ? <FieldError>{error}</FieldError> : null}
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating account..." : "Create Account"}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <Link to="/login">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}

import { SignupForm } from "@/components/signup-form"
import { useAuth } from '@/hooks/auth/UseAuth'
import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const context = useAuth();
  const navigate = useNavigate();

  if (context.user) {
    return(
      navigate("/dashboard")
    );
  } else {
    return (
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a href="#" className="flex items-center gap-2 self-center font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              {/* icono aqui */}
            </div>
            Acme Inc.
          </a>
          <SignupForm />
        </div>
      </div>
    );
  }
}
import { createContext, useEffect, useState, type ReactNode } from "react";
import { getCsrf, getCurrentUser, loginUser, logoutUser } from "@/api/auth.api";
import type { AuthUser, LoginPayload } from '@/types/auth';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (credentials: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode}) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCsrf()
      .then(() => getCurrentUser())
      .then(({ user }) => setUser(user))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false))
  }, []);

  const login = async (credentials: LoginPayload) =>
  {
    try {
      const { user } = await loginUser(credentials);
      setUser(user);
      await getCsrf();
    } catch (error) {
      console.error("inicio de sesion", error);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      await getCsrf();
    } catch (error) {
      console.error("al cerrar de sesion", error);
    }
  }

  return ( 
    <AuthContext.Provider value={{ user, isLoading, login, logout}}>
      {children}
    </AuthContext.Provider>
  )

}


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
    const { user } = await loginUser(credentials);
    setUser(user);
    await getCsrf();
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    await getCsrf();
  }

  return ( 
    <AuthContext.Provider value={{ user, isLoading, login, logout}}>
      {children}
    </AuthContext.Provider>
  )

}


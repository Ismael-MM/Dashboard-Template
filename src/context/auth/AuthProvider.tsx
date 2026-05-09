import { getCsrf, getCurrentUser, loginUser, logoutUser } from "@/api/auth.api";
import { useEffect, useState, type ReactNode } from "react";
import type { AuthUser, LoginPayload } from '@/types/auth';
import { AuthContext } from './AuthContext';


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
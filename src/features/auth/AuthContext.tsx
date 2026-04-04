import { createContext, useEffect, useState, type ReactNode } from "react";
import { getCurrentUser, loginUser, logoutUser } from "@/api/auth.api";
import type { AuthUser, LoginPayload } from "@/api/auth.api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string}) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode}) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then(({ user }) => setUser(user))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false))
  }, []);

  const login = async (credentials: LoginPayload) =>
  {
    const { user } = await loginUser(credentials);
    setUser(user);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  }

  return ( 
    <AuthContext.Provider value={{ user, isLoading, login, logout}}>
      {children}
    </AuthContext.Provider>
  )

}


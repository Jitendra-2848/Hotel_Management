import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { authApi, type User, type LoginPayload, type RegisterPayload } from "../lib/api";

export interface AuthContextType {
  user: User | null;
  role: "GUEST" | "STAFF" | "MANAGER" | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
  hasRole: (roles: string | string[]) => boolean;
  clearError: () => void;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Initialize and verify user auth status purely via HTTP-only cookie
  const refetchUser = useCallback(async () => {
    try {
      const profile = await authApi.getProfile();
      setUser(profile);
    } catch {
      // Cookie is missing or expired
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetchUser();
  }, [refetchUser]);

  const login = async (payload: LoginPayload): Promise<User> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authApi.login(payload);
      setUser(res.user);
      return res.user;
    } catch (err: any) {
      setError(err.message || "Failed to log in");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload): Promise<User> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authApi.register(payload);
      setUser(res.user);
      return res.user;
    } catch (err: any) {
      setError(err.message || "Failed to register");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authApi.logout();
    } catch (err: any) {
      console.warn("Logout API notice:", err.message);
    } finally {
      setUser(null);
      setError(null);
      setIsLoading(false);
    }
  };

  const hasRole = useCallback(
    (roles: string | string[]): boolean => {
      if (!user) return false;
      if (Array.isArray(roles)) {
        return roles.includes(user.role);
      }
      return user.role === roles;
    },
    [user]
  );

  const value: AuthContextType = {
    user,
    role: user?.role || null,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    hasRole,
    clearError,
    refetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

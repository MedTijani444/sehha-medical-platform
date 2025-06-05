import { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "./queryClient";
import { useLocation } from "wouter";

interface User {
  id: number;
  email: string;
  fullName: string;
  age?: number;
  gender?: string;
  chronicIllnesses?: string;
  currentMedications?: string;
  allergies?: string;
  language?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Initialize token from localStorage on mount with conflict detection
  useEffect(() => {
    // Clear any conflicting auth data first
    const storedToken = localStorage.getItem("authToken");
    
    // Force clear all auth-related items to prevent conflicts
    const authKeys = Object.keys(localStorage).filter(key => 
      key.includes('auth') || key.includes('token') || key.includes('user')
    );
    
    if (authKeys.length > 1) {
      // Multiple auth tokens detected, clear everything
      authKeys.forEach(key => localStorage.removeItem(key));
      queryClient.clear();
      setToken(null);
      return;
    }
    
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/user/profile"],
    enabled: !!token,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await apiRequest("/api/auth/login", "POST", { email, password });
      return response.json();
    },
    onSuccess: (data) => {
      setToken(data.token);
      localStorage.setItem("authToken", data.token);
      queryClient.setQueryData(["/api/user/profile"], data.user);
      
      // Check for stored redirect URL
      const redirectUrl = localStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin');
        setLocation(redirectUrl);
      } else {
        setLocation("/dashboard");
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await apiRequest("/api/auth/register", "POST", userData);
      return response.json();
    },
    onSuccess: (data) => {
      setToken(data.token);
      localStorage.setItem("authToken", data.token);
      queryClient.setQueryData(["/api/user/profile"], data.user);
      
      // Check for stored redirect URL
      const redirectUrl = localStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin');
        setLocation(redirectUrl);
      } else {
        setLocation("/dashboard");
      }
    },
  });

  const logout = () => {
    setToken(null);
    localStorage.removeItem("authToken");
    queryClient.clear();
    queryClient.invalidateQueries();
    setLocation("/");
  };

  // Set authorization header when token changes
  useEffect(() => {
    if (token) {
      // Update default headers for future requests
      queryClient.setDefaultOptions({
        queries: {
          ...queryClient.getDefaultOptions().queries,
          queryFn: async ({ queryKey }) => {
            const res = await fetch(queryKey[0] as string, {
              credentials: "include",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (res.status === 401) {
              logout();
              throw new Error("Unauthorized");
            }

            if (!res.ok) {
              const text = (await res.text()) || res.statusText;
              throw new Error(`${res.status}: ${text}`);
            }

            return await res.json();
          },
        },
      });
    }
  }, [token, queryClient]);

  const value: AuthContextType = {
    user: user || null,
    login: async (email: string, password: string) => {
      await loginMutation.mutateAsync({ email, password });
    },
    register: async (userData: any) => {
      await registerMutation.mutateAsync(userData);
    },
    logout,
    isAuthenticated: !!user,
    isLoading: isLoading || loginMutation.isPending || registerMutation.isPending,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Higher-order component to protect routes
export function withAuth<T extends object>(Component: React.ComponentType<T>) {
  return function AuthenticatedComponent(props: T) {
    const { isAuthenticated, isLoading } = useAuth();
    const [, setLocation] = useLocation();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        setLocation("/auth");
      }
    }, [isAuthenticated, isLoading, setLocation]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}

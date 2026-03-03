"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import api from "./api";

interface Merchant {
  id: string;
  business_name: string;
  email: string;
  merchant_tier?: "tier_1" | "tier_2";
  api_key?: string;
  api_secret?: string;
}

interface AuthContextType {
  merchant: Merchant | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  business_name: string;
  email: string;
  password: string;
  phone?: string;
  business_type?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedMerchant = localStorage.getItem("merchant");
    if (savedToken && savedMerchant) {
      setToken(savedToken);
      setMerchant(JSON.parse(savedMerchant));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    const { token: newToken, merchant: merchantData } = res.data.data;
    localStorage.setItem("token", newToken);
    localStorage.setItem("merchant", JSON.stringify(merchantData));
    setToken(newToken);
    setMerchant(merchantData);
    router.push("/dashboard");
  };

  const register = async (data: RegisterData) => {
    const res = await api.post("/auth/register", data);
    const { token: newToken, merchant: merchantData } = res.data.data;
    localStorage.setItem("token", newToken);
    localStorage.setItem("merchant", JSON.stringify(merchantData));
    setToken(newToken);
    setMerchant(merchantData);
    router.push("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("merchant");
    setToken(null);
    setMerchant(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        merchant,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

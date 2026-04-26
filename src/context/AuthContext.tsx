"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { UsuarioInfo, LoginCredentials } from "@/lib/types";
import { api } from "@/lib/api";

interface AuthContextType {
  user: UsuarioInfo | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UsuarioInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("cogerh_user");
    const storedToken = localStorage.getItem("cogerh_token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Erro ao processar dados do usuário:", error);
        localStorage.removeItem("cogerh_user");
        localStorage.removeItem("cogerh_token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await api.login(credentials);
    localStorage.setItem("cogerh_token", response.token);
    localStorage.setItem("cogerh_user", JSON.stringify(response.usuario));
    setUser(response.usuario);
  };

  const logout = () => {
    localStorage.removeItem("cogerh_token");
    localStorage.removeItem("cogerh_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

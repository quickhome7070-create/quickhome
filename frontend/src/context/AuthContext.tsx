"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getMe } from "../services/auth";
import { useRouter } from "next/navigation";



type User = {
  _id: string;
  name: string;
  email: string;
   subscription?: Subscription;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (data: User) => void;
  logout: () => void;
};

interface Subscription {
  status: string;
  isActive: boolean;
  trialEndsAt?: string;
  freeContactsRemaining?: number;
}


const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
const router = useRouter();
  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getMe();
        setUser(data?.user || null);
      } catch (error) {
        console.error("Auth load failed:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

 const login = (data: any) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  setUser(data.user);
};



  const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
   router.push("/");
  setUser(null);
};

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthContext missing");
  return context;
};

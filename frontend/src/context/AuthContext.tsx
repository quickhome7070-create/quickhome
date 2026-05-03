"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext<any>(null);

const API = process.env.NEXT_PUBLIC_API_URL;

export const AuthProvider = ({ children }: any) => {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadUser = async () => {

      try {

        const res = await fetch(
          `${API}/auth/me`,
          {
            credentials: "include",
          }
        );

        if (res.ok) {

          const data = await res.json();

          setUser(data.user);
        }

      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    };

    loadUser();

  }, []);

  // ✅ LOGOUT FUNCTION
  const logout = async () => {

    try {

      await fetch(
        `${API}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      // ✅ CLEAR USER
      setUser(null);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout, // ✅ expose logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
import { apiFetch } from "./api";

export const register = (data: any) =>
  apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

export async function login(data: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  // 🔥 SAVE TOKEN
  if (result.token) {
    localStorage.setItem("token", result.token);
  }

  return result;
}


export const getMe = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Not authenticated");

  return res.json();
};



export const logout = () =>
  apiFetch("/auth/logout", {
    method: "POST",
  });

import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true, // ✅ send cookies automatically
});

export default API;

export async function apiFetch(
  url: string,
  options: RequestInit = {}
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${url}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      credentials: "include", // ✅ send cookies
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));

    throw new Error(
      err.message || "API Error"
    );
  }

  return res.json();
}
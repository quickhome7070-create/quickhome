"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API } from "@/src/lib/api";


export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleRegister = async () => {
    const res = await fetch(API.register, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Registered successfully");
      router.push("/login");
    } else {
      alert(data.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 shadow rounded">
      <h2 className="text-xl font-bold mb-4">Register</h2>

      <input className="w-full border p-2 mb-3" placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })} />

      <input className="w-full border p-2 mb-3" placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })} />

      <input className="w-full border p-2 mb-3" placeholder="Phone"
        onChange={(e) => setForm({ ...form, phone: e.target.value })} />

      <input type="password" className="w-full border p-2 mb-3" placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })} />

      <button
        onClick={handleRegister}
        className="w-full bg-green-600 text-white p-2 rounded"
      >
        Register
      </button>
    </div>
  );
}

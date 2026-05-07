"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const { token } = useParams();

  const router = useRouter();

  const [password, setPassword] = useState("");

  const handleReset = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password/${token}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      }
    );

    const data = await res.json();

    alert(data.message);

    if (res.ok) {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="border p-6 rounded w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">
          Reset Password
        </h1>

        <input
          type="password"
          placeholder="New Password"
          className="border p-3 w-full rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleReset}
          className="bg-green-600 text-white w-full mt-4 py-3 rounded"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}
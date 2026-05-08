"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await res.json();

    setMessage(data.message || "Done");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="border p-6 rounded w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">
          Forgot Password
        </h1>

        <input
          type="email"
          placeholder="Enter email"
          className="border p-3 w-full rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
  >
    {showPassword ? (
      // Eye Off
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3l18 18"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.584 10.587a2 2 0 102.829 2.829"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.88 5.09A9.953 9.953 0 0112 5c5 0 9 7 9 7a17.3 17.3 0 01-2.164 2.94M6.228 6.228C4.312 7.526 3 9.5 3 9.5s4 7 9 7a8.96 8.96 0 004.773-1.228"
        />
      </svg>
    ) : (
      // Eye
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12z"
        />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )}
  </button>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white w-full mt-4 py-3 rounded"
        >
          Send Reset Link
        </button>

        {message && (
          <p className="mt-3 text-sm text-green-600">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
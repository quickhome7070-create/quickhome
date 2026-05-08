"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
const [sent, setSent] = useState(false)
  const handleSubmit = async () => {
  if (sent) return;

  setLoading(true);

  try {
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

    setMessage(data.message || "Reset link sent");

    if (res.ok) {
      setSent(true);
    }

  } catch (err) {
    setMessage("Something went wrong");
  }

  setLoading(false);
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
  onClick={handleSubmit}
  disabled={loading || sent}
  className={`w-full mt-4 py-3 rounded font-semibold transition ${
    sent
      ? "bg-green-600 text-white cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700 text-white"
  }`}
>
  {loading
    ? "Sending..."
    : sent
    ? "Link Sent ✓"
    : "Send Reset Link"}
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
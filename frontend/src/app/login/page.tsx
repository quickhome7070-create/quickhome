"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { API } from "@/src/lib/api";
import Link from "next/link";

export default function LoginPage() {
  const { setUser } = useAuth();
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    try {
      const res = await fetch(API.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

     if (res.ok) {
setUser(data.user)
  // 🔐 Check if admin
  if (data.user.role === "admin") {
    router.push("/admin"); // ✅ admin dashboard
  } else {
    
    router.push("/"); // ✅ normal user
  }

} else {
  alert(data.message || "Login failed");
}
    } catch (err) {
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200">

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
          Welcome
        </h2>
        <p className="text-center text-gray-500 text-sm mt-1">
          Login to your account
        </p>

        {/* Inputs */}
        <div className="mt-6 space-y-4">
          <input
            className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition disabled:opacity-70"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-2 my-5">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Register */}
        <p className="text-center text-gray-600 text-sm">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
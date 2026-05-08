"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { API } from "@/src/lib/api";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Email Validation
  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(value)) {
      setEmailError("Enter valid email address");
      return false;
    }

    setEmailError("");
    return true;
  };

  const handleLogin = async () => {
    // ✅ Validate Email
    if (!validateEmail(email)) return;

    setLoading(true);

    try {
      const res = await fetch(API.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);

        if (data.user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
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

        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Welcome
        </h2>

        <p className="text-center text-gray-500 text-sm mt-1">
          Login to your account
        </p>

        {/* OTP Login */}
        <Link
          href="/otp-login"
          className="w-full flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-50 transition mt-6"
        >
          📱 Login with OTP
        </Link>

        {/* Divider */}
        <div className="flex items-center gap-2 my-5">
          <div className="flex-1 h-px bg-gray-300"></div>

          <span className="text-gray-400 text-sm">
            OR LOGIN WITH EMAIL
          </span>

          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Form */}
        <div className="space-y-4">

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);

                if (emailError) {
                  validateEmail(e.target.value);
                }
              }}
              onBlur={() => validateEmail(email)}
              className={`w-full border rounded-xl p-3 text-sm outline-none focus:ring-2 ${
                emailError
                  ? "border-red-500 focus:ring-red-300"
                  : "focus:ring-blue-500"
              }`}
            />

            {emailError && (
              <p className="text-red-500 text-sm mt-1">
                {emailError}
              </p>
            )}
          </div>

          {/* Password */}
         {/* Password */}
<div className="relative">

  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full border rounded-xl p-3 pr-12 text-sm outline-none focus:ring-2 focus:ring-blue-500"
  />

  {/* Eye Icon */}
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
</div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        {/* Login Button */}
       <button
  onClick={handleLogin}
  disabled={loading}
  className="w-full mt-5 bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 hover:from-orange-600 hover:via-amber-500 hover:to-yellow-400 text-black py-3 rounded-xl font-semibold shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-70"
>
  {loading ? "Logging in..." : "Login"}
</button>

        {/* Bottom */}
        <div className="flex items-center gap-2 my-5">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

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
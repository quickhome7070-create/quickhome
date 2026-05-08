"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API } from "@/src/lib/api";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

const [errors, setErrors] = useState({
  name: "",
  email: "",
  phone: "",
  password: "",
});

const validateForm = () => {
  let valid = true;

  const newErrors = {
    name: "",
    email: "",
    phone: "",
    password: "",
  };

  // Name
  if (!form.name.trim()) {
    newErrors.name = "Full name is required";
    valid = false;
  }

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!form.email.trim()) {
    newErrors.email = "Email is required";
    valid = false;
  } else if (!emailRegex.test(form.email)) {
    newErrors.email = "Enter valid email";
    valid = false;
  }

  // Phone
  const phoneRegex = /^[0-9]{10}$/;

  if (!form.phone.trim()) {
    newErrors.phone = "Phone number is required";
    valid = false;
  } else if (!phoneRegex.test(form.phone)) {
    newErrors.phone = "Enter valid 10 digit phone number";
    valid = false;
  }

  // Password
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  if (!form.password.trim()) {
    newErrors.password = "Password is required";
    valid = false;
  } else if (!passwordRegex.test(form.password)) {
    newErrors.password =
      "Min 8 chars with uppercase, lowercase, number & special char";
    valid = false;
  }

  setErrors(newErrors);

  return valid;
};

  const handleRegister = async () => {

    if (!validateForm()) return;
    setLoading(true);

    try {
      const res = await fetch(API.register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registered successfully 🎉");
        router.push("/login");
      } else {
        alert(data.message || "Registration failed");
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
          Create Account
        </h2>
        <p className="text-center text-gray-500 text-sm mt-1">
          Join gharDestiny today
        </p>

        {/* Inputs */}
        <div className="mt-6 space-y-4">
{/* Full Name */}
          <div>
  <input
    className={`w-full border rounded-xl p-3 text-sm outline-none focus:ring-2 ${
      errors.name
        ? "border-red-500 focus:ring-red-400"
        : "focus:ring-green-500"
    }`}
    placeholder="Full Name"
    onChange={(e) => setForm({ ...form, name: e.target.value })}
  />

  {errors.name && (
    <p className="text-red-500 text-xs mt-1">
      {errors.name}
    </p>
  )}
</div>

         {/* Email */}
         <div>
  <input
    className={`w-full border rounded-xl p-3 text-sm outline-none focus:ring-2 ${
      errors.email
        ? "border-red-500 focus:ring-red-400"
        : "focus:ring-green-500"
    }`}
    placeholder="Email"
    onChange={(e) => setForm({ ...form, email: e.target.value })}
  />

  {errors.email && (
    <p className="text-red-500 text-xs mt-1">
      {errors.email}
    </p>
  )}
</div>

          {/* Phone */}

          <div>
  <input
    className={`w-full border rounded-xl p-3 text-sm outline-none focus:ring-2 ${
      errors.phone
        ? "border-red-500 focus:ring-red-400"
        : "focus:ring-green-500"
    }`}
    placeholder="Phone Number"
    onChange={(e) => setForm({ ...form, phone: e.target.value })}
  />

  {errors.phone && (
    <p className="text-red-500 text-xs mt-1">
      {errors.phone}
    </p>
  )}
</div>

{/* Password */}
<div>

  <div className="relative">

    <input
      type={showPassword ? "text" : "password"}
      className={`w-full border rounded-xl p-3 pr-12 text-sm outline-none focus:ring-2 ${
        errors.password
          ? "border-red-500 focus:ring-red-400"
          : "focus:ring-green-500"
      }`}
      placeholder="Password"
      onChange={(e) =>
        setForm({ ...form, password: e.target.value })
      }
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

  {errors.password && (
    <p className="text-red-500 text-xs mt-1">
      {errors.password}
    </p>
  )}

</div>
        </div>

        {/* Button */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full mt-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition disabled:opacity-70"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-2 my-5">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Login Link */}
        <p className="text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-green-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";

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

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [otpLoading, setOtpLoading] =
    useState(false);

  const [otp, setOtp] =
    useState("");

  const [step, setStep] =
    useState(1);

  const [timer, setTimer] =
    useState(0);

  const [errors, setErrors] =
    useState({
      name: "",
      email: "",
      phone: "",
      password: "",
      otp: "",
    });

  useEffect(() => {

    if (timer <= 0) return;

    const interval =
      setInterval(() => {

        setTimer((prev) => prev - 1);

      }, 1000);

    return () =>
      clearInterval(interval);

  }, [timer]);

  const validateForm = () => {

    let valid = true;

    const newErrors = {
      name: "",
      email: "",
      phone: "",
      password: "",
      otp: "",
    };

    // NAME
    if (!form.name.trim()) {
      newErrors.name =
        "Full name is required";

      valid = false;
    }

    // EMAIL
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email.trim()) {

      newErrors.email =
        "Email is required";

      valid = false;

    } else if (
      !emailRegex.test(form.email)
    ) {

      newErrors.email =
        "Enter valid email";

      valid = false;
    }

    // PHONE
    const phoneRegex =
      /^[6-9]\d{9}$/;

    if (!form.phone.trim()) {

      newErrors.phone =
        "Phone number is required";

      valid = false;

    } else if (
      !phoneRegex.test(form.phone)
    ) {

      newErrors.phone =
        "Enter valid 10 digit number";

      valid = false;
    }

    // PASSWORD
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!form.password.trim()) {

      newErrors.password =
        "Password is required";

      valid = false;

    } else if (
      !passwordRegex.test(form.password)
    ) {

      newErrors.password =
        "Weak password";

      valid = false;
    }

    setErrors(newErrors);

    return valid;
  };

  // SEND OTP
  const sendOTP = async () => {

    if (!validateForm()) return;

    try {

      setOtpLoading(true);

     const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/auth/send-otp`,
  {
    method: "POST",

    credentials: "include",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      phone: form.phone,
    }),
  }
);
      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.message
        );
      }

      setStep(2);

      setTimer(30);

      alert("OTP Sent");

    } catch (error: any) {

      alert(error.message);

    } finally {

      setOtpLoading(false);
    }
  };

  // REGISTER
  const handleRegister = async () => {

    if (!otp.trim()) {

      setErrors({
        ...errors,
        otp: "OTP is required",
      });

      return;
    }

    try {

      setLoading(true);

      const res = await fetch(
        API.register,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ...form,
            otp,
          }),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.message
        );
      }

      alert(
        "Registered successfully 🎉"
      );

      router.push("/login");

    } catch (error: any) {

      alert(error.message);

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">

      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl">

        <h1 className="text-3xl font-bold text-center">
          Create Account
        </h1>

        <div className="mt-6 space-y-4">

          {/* NAME */}
          <div>

            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              className={`w-full border rounded-xl p-3 outline-none ${
                errors.name
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-orange-400"
              }`}
            />

            {errors.name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.name}
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div>

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              className={`w-full border rounded-xl p-3 outline-none ${
                errors.email
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-orange-400"
              }`}
            />

            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* PHONE */}
          <div>

            <input
              type="text"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value,
                })
              }
              className={`w-full border rounded-xl p-3 outline-none ${
                errors.phone
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-orange-400"
              }`}
            />

            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">
                {errors.phone}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="relative">

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password:
                    e.target.value,
                })
              }
              className={`w-full border rounded-xl p-3 pr-12 outline-none ${
                errors.password
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-orange-400"
              }`}
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

            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* OTP SECTION */}
          {step === 2 && (

            <div>

              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value
                  )
                }
                className={`w-full border rounded-xl p-3 outline-none ${
                  errors.otp
                    ? "border-red-500"
                    : "focus:ring-2 focus:ring-orange-400"
                }`}
              />

              {errors.otp && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.otp}
                </p>
              )}
            </div>
          )}

          {/* SEND OTP */}
          {step === 1 ? (

            <button
              onClick={sendOTP}
              disabled={
                otpLoading ||
                timer > 0
              }
              className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 text-black shadow-md"
            >
              {otpLoading
                ? "Sending..."
                : "Send OTP"}
            </button>

          ) : (

            <>
              {/* REGISTER */}
              <button
                onClick={
                  handleRegister
                }
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 text-black shadow-md"
              >
                {loading
                  ? "Creating..."
                  : "Register"}
              </button>

              {/* RESEND */}
              <button
                type="button"
                disabled={
                  timer > 0
                }
                onClick={sendOTP}
                className="w-full border rounded-xl py-3"
              >
                {timer > 0
                  ? `Resend OTP in ${timer}s`
                  : "Resend OTP"}
              </button>
            </>
          )}
        </div>

        <p className="text-center text-sm text-gray-600 mt-5">
          Already have account?{" "}

          <Link
            href="/login"
            className="text-orange-600 font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

export default function OTPLogin() {
  const { setUser } = useAuth();
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // ⏳ countdown state
  const [timer, setTimer] = useState(0);

  // ⏱️ countdown logic
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

 const sendOTP = async () => {
  if (loading || timer > 0) return;

  // Indian phone validation
  const phoneRegex = /^[6-9]\d{9}$/;

  if (!phone.trim()) {
    setPhoneError("Phone number is required");
    return;
  }

  if (!phoneRegex.test(phone)) {
    setPhoneError("Enter valid 10 digit phone number");
    return;
  }

  setPhoneError("");
  setLoading(true);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/otp/send-otp`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone }),
    }
  );

  setLoading(false);

  if (res.ok) {
    setStep(2);
    setTimer(30);
  } else {
    const data = await res.json();
    alert(data.message);
  }
};

  const verifyOTP = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/otp/verify-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ phone, otp }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      setUser(data.user);
      router.push("/");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl shadow w-full max-w-md">
        <h1 className="text-2xl font-bold mb-5">
          Mobile OTP Login
        </h1>

      {/* STEP 1 */}
{step === 1 && (
  <div className="space-y-4">

    <div>
      <input
        type="text"
        placeholder="Enter phone number"
        className={`w-full p-3 rounded-xl outline-none border ${
          phoneError
            ? "border-red-500 focus:ring-2 focus:ring-red-400"
            : "border-gray-300 focus:ring-2 focus:ring-orange-400"
        }`}
        value={phone}
        onChange={(e) => {
          setPhone(e.target.value);
          setPhoneError("");
        }}
      />

      {phoneError && (
        <p className="text-red-500 text-sm mt-1">
          {phoneError}
        </p>
      )}
    </div>

    <button
      disabled={loading || timer > 0}
      onClick={sendOTP}
      className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 shadow-md ${
        loading || timer > 0
          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
          : "bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 hover:from-orange-600 hover:via-amber-500 hover:to-yellow-400 text-black hover:shadow-xl hover:scale-[1.02]"
      }`}
    >
      {loading
        ? "Sending..."
        : timer > 0
        ? `Wait ${timer}s`
        : "Send OTP"}
    </button>

  </div>
)}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full border p-3 rounded-xl"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={verifyOTP}
              className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl"
            >
              Verify OTP
            </button>

            {/* 🔁 RESEND */}
           <button
  disabled={timer > 0}
  onClick={sendOTP}
  className={`w-full mt-3 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md ${
    timer > 0
      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
      : "bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 hover:from-orange-600 hover:via-amber-500 hover:to-yellow-400 text-black hover:shadow-xl hover:scale-[1.02]"
  }`}
>
  {timer > 0
    ? `Resend OTP in ${timer}s`
    : "Resend OTP"}
</button>
          </>
        )}
      </div>
    </div>
  );
}
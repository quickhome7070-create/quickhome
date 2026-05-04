"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

export default function OTPLogin() {
  const { setUser } = useAuth();
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

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
      setTimer(30); // 🔥 start countdown
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
          <>
            <input
              type="text"
              placeholder="Enter phone number"
              className="w-full border p-3 rounded-xl"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <button
              disabled={loading || timer > 0}
              onClick={sendOTP}
              className="w-full mt-4 bg-black text-white py-3 rounded-xl disabled:opacity-60"
            >
              {loading
                ? "Sending..."
                : timer > 0
                ? `Wait ${timer}s`
                : "Send OTP"}
            </button>
          </>
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
              className="w-full mt-3 text-sm text-blue-600 disabled:text-gray-400"
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
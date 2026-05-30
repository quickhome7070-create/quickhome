"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
  useRouter,
} from "next/navigation";

export default function PaymentSuccessPage() {

  const params =
    useSearchParams();

  const router =
    useRouter();

  const [message, setMessage] =
    useState("Verifying payment...");

  useEffect(() => {

    const verify = async () => {

      const orderId =
        params.get("order_id");

      if (!orderId) return;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            orderId,
          }),
        }
      );

      const data =
        await res.json();

      if (data.success) {

        setMessage(
          "Payment successful 🎉"
        );

        setTimeout(() => {
          router.push("/");
        }, 2000);

      } else {

        setMessage(
          "Payment verification failed"
        );
      }
    };

    verify();

  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold">
        {message}
      </h1>
    </div>
  );
}
"use client";

import Loader from "@/src/components/Loader";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [message, setMessage] = useState("Verifying payment...");

  useEffect(() => {
    const verify = async () => {
      const orderId = searchParams.get("order_id");

      if (!orderId) {
        setMessage("Invalid payment.");
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/payment/verify/${orderId}`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        if (data.status === "PAID") {
          setMessage("Payment Successful 🎉");

          setTimeout(() => {
            router.push("/");
          }, 1500);

          return;
        }

        if (data.status === "PENDING") {
          setMessage("Payment is being verified...");

          setTimeout(() => {
            router.refresh();
          }, 3000);

          return;
        }

        setMessage("Payment Cancelled");

      } catch (err) {
        setMessage("Unable to verify payment.");
      }
    };

    verify();
  }, []);

 return (
  <div className="min-h-screen flex flex-col items-center justify-center px-6">
    {message === "Verifying payment..." ||
    message === "Payment is being verified..." ? (
      <>
        <Loader />
        <p className="mt-4 text-gray-600 text-sm">
          {message}
        </p>
      </>
    ) : (
      <h1 className="text-xl font-semibold text-center">
        {message}
      </h1>
    )}
  </div>
);
}


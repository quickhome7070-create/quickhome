"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function PaymentSuccessClient() {
  const params = useSearchParams();
  const router = useRouter();

  const [message, setMessage] = useState<string>(
    "Verifying payment..."
  );

  useEffect(() => {
    const verify = async (): Promise<void> => {
      try {
        const orderId = params.get("order_id");

        if (!orderId) {
          setMessage("Order ID not found");
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/payment/verify`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              orderId,
            }),
          }
        );

        const data: {
          success: boolean;
          paymentStatus?: string;
          message?: string;
        } = await res.json();

        if (data.success) {
          setMessage("Payment successful 🎉");

          setTimeout(() => {
            router.push("/");
          }, 2000);
        } else {
          setMessage(
            data.message ||
              "Payment verification failed"
          );
        }
      } catch (error) {
        console.error(error);
        setMessage("Something went wrong");
      }
    };

    verify();
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold">
        {message}
      </h1>
    </div>
  );
}
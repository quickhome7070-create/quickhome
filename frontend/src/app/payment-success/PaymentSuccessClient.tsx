"use client";

import { useEffect } from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

export default function PaymentSuccessClient() {

  const router = useRouter();

  const params =
    useSearchParams();

  useEffect(() => {

    const verify =
      async () => {

        const orderId =
          params.get("order_id");

        if (!orderId) return;

        const res =
          await fetch(
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

          alert(
            "Premium Activated 🎉"
          );

          router.push("/");
        }
      };

    verify();

  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold">
        Verifying payment...
      </h1>
    </div>
  );
}
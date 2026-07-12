"use client";

import { useState } from "react";

export default function CashfreePaymentButton() {
  const [loading, setLoading] = useState(false);

  const payNow = async () => {
    try {
      setLoading(true);

      // Create Order
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/create-order`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await res.json();
      console.log("Create Order Response:", data);

      if (!data.success || !data.paymentSessionId) {
        alert("Unable to create payment order");
        return;
      }

      // Load Cashfree SDK
      const { load } = await import(
        "@cashfreepayments/cashfree-js"
      );

      const cf = await load({
        mode: "production", // use "sandbox" while testing
      });

      // Open Checkout
      await cf.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_self",
      });

    } catch (error) {
      console.error(error);
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={payNow}
      disabled={loading}
      className="bg-green-600 text-white px-6 py-3 rounded-xl disabled:opacity-50"
    >
      {loading ? "Processing..." : "Pay Now"}
    </button>
  );
}
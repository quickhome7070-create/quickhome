"use client";

import { useState } from "react";
import Script from "next/script";

export default function UpiPaymentButton() {
  const [loading, setLoading] = useState(false);

  const payNow = async () => {
    try {
      setLoading(true);

       

      // 🔹 Step 1: Create Razorpay order
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/razorpay/order/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            
          },
          credentials: "include",
          body: JSON.stringify({
            amount: 500,
          }),
        }
      );

      const order = await res.json();

      if (!order?.id) {
        alert("Order creation failed");
        setLoading(false);
        return;
      }

      // 🔹 Step 2: Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "GharDestiny Premium",

        method: {
          upi: true,
        },

        // 🔥 Step 3: Handle payment success
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/subscription/activate-paid`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  
                },
                credentials: "include",
                body: JSON.stringify(response), // ✅ VERY IMPORTANT
              }
            );

            const data = await verifyRes.json();

            if (!data.success) {
              alert("Payment verification failed");
              return;
            }

            // ✅ Success → redirect
            window.location.href = "/";
          } catch (err) {
            console.error(err);
            alert("Something went wrong after payment");
          }
        },

        // 🔥 Optional: Handle failure
        modal: {
          ondismiss: function () {
          
          },
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      <button
        onClick={payNow}
        disabled={loading}
        className="bg-green-600 text-white px-6 py-3 rounded-xl"
      >
        {loading ? "Processing..." : "Pay via UPI"}
      </button>
    </>
  );
}
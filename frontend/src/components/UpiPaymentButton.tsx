"use client";

import { useState } from "react";
import Script from "next/script";

export default function UpiPaymentButton() {

  const [loading, setLoading] =
    useState(false);

  const payNow = async () => {

    try {

      setLoading(true);

      // =========================
      // CREATE ORDER
      // =========================
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/razorpay/order/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            amount: 99,
          }),
        }
      );

      const order = await res.json();

      if (!order?.id) {

        alert("Order creation failed");

        return;
      }

      // =========================
      // RAZORPAY OPTIONS
      // =========================
      const options = {

        key:
          process.env
            .NEXT_PUBLIC_RAZORPAY_KEY_ID,

        amount: order.amount,

        currency: order.currency,

        order_id: order.id,

        name: "gharDestiny Premium",

        description:
          "Premium Subscription",

        method: {
          upi: true,
        },

        theme: {
          color: "#16a34a",
        },

        // =========================
        // PAYMENT SUCCESS
        // =========================
        handler: async function (
          response: any
        ) {

          try {

            const verifyRes =
              await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/razorpay/verify`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type":
                      "application/json",
                  },
                  credentials: "include",
                  body: JSON.stringify(
                    response
                  ),
                }
              );

            const data =
              await verifyRes.json();

            if (!data.success) {

              alert(
                data.message ||
                "Payment verification failed"
              );

              return;
            }

            alert(
              "Payment successful!"
            );

            window.location.href = "/";

          } catch (err) {

            console.error(err);

            alert(
              "Something went wrong after payment"
            );
          }
        },

        // =========================
        // PAYMENT MODAL CLOSE
        // =========================
        modal: {

          ondismiss: function () {

            console.log(
              "Payment popup closed"
            );
          },
        },
      };

      // =========================
      // OPEN RAZORPAY
      // =========================
      const paymentObject =
        new (window as any).Razorpay(
          options
        );

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
        className="bg-green-600 hover:bg-green-700 transition text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-70"
      >
        {loading
          ? "Processing..."
          : "Pay via UPI"}
      </button>
    </>
  );
}
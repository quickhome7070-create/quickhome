"use client";

import { useState } from "react";
import Script from "next/script";
interface Props {
  planId: string;
}

export default function SubscribeButton({ planId }: Props) {
  const [loading, setLoading] = useState(false);

//   const loadScript = (): Promise<boolean> =>
//     new Promise((resolve) => {
//       const s = document.createElement("script");
//       s.src = "https://checkout.razorpay.com/v1/checkout.js";
//       s.onload = () => resolve(true);
//       s.onerror = () => resolve(false);
//       document.body.appendChild(s);
//     });

 const subscribe = async () => {
  setLoading(true);

   

  if (!(window as any).Razorpay) {
    alert("Razorpay SDK not loaded yet. Please try again.");
    setLoading(false);
    return;
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/razorpay/subscription/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        
      },
      credentials: "include",
      body: JSON.stringify({ planId }),
    }
  );

//   const sub = await res.json();
const order = await res.json();
   const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: order.amount,
  currency: order.currency,
  order_id: order.id,
    method: {
    upi: true,
   
  },
  theme: { color: "#2563eb" },
    name: "GharDestiny Premium",
    description: "Premium Plan",
    
    handler: async () => {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/razorpay/subscription/activate`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      window.location.href = "/subscription-success";
    },
  };

  const paymentObject = new (window as any).Razorpay(options);
  paymentObject.open();

  setLoading(false);
};

  return (
    <>
     <Script
    src="https://checkout.razorpay.com/v1/checkout.js"
    strategy="lazyOnload"
  />

    <button
      onClick={subscribe}
      disabled={loading}
      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition"
    >
      {loading ? "Processing..." : "Subscribe Now"}
    </button>
    </>
  
  );
}

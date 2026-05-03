"use client";


import SubscribeButton from "@/src/components/SubscribeButton";
import UpiPaymentButton from "@/src/components/UpiPaymentButton";
import { useAuth } from "@/src/context/AuthContext";


export default function PlansPage() {
  const { user, loading } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please login to subscribe.</p>
      </div>
    );
  }
const startTrial = async () => {
   

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/subscription/trial/start`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  const data = await res.json();

  if (data.success) {
    alert("🎉 10 Free Contacts Activated!");
  }
};
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <h1 className="text-3xl font-bold text-center mb-10">
        Upgrade to Premium 🚀
      </h1>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
{/* <div className="bg-white rounded-2xl shadow-lg p-8 text-center border hover:shadow-2xl transition">
       {user?.subscription?.status !== "trial" && (
  <button
    onClick={startTrial}
    className="bg-green-600 text-white px-6 py-3 rounded-xl mb-4"
  >
    🎁 Start 7-Day Free Trial
  </button>
)}
        </div> */}
        {/* Monthly */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center border hover:shadow-2xl transition">
          <h2 className="text-xl font-bold">Basic Monthly</h2>
          <p className="text-4xl font-extrabold my-6">₹99</p>

            

         {/* <SubscribeButton planId="plan_SI15zUEV1tQsNr" /> */}
          <UpiPaymentButton/>
        </div>

        {/* Yearly */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center border-2 border-blue-600 hover:shadow-2xl transition">
          <h2 className="text-xl font-bold">Pro Yearly</h2>
          <p className="text-4xl font-extrabold my-6">₹999</p>

          {/* <SubscribeButton planId="plan_SI15zUEV1tQsNr" /> */}
          <UpiPaymentButton/>
        </div>

      </div>
    </div>
  );
}

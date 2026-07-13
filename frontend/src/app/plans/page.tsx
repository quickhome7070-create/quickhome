"use client";

import CashfreePaymentButton from "@/src/components/CashfreePaymentButton";
import { useAuth } from "@/src/context/AuthContext";

export default function PlansPage() {

  const { user } = useAuth();


  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Please login to continue
      </div>
    );
  }


  if (
    user.subscription?.status === "premium" &&
    new Date(user.subscription.expiresAt) > new Date()
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-green-100 p-8 rounded-xl text-center">

          <h1 className="text-2xl font-bold text-green-700">
            🎉 Premium Active
          </h1>

          <p className="mt-3">
            You already have premium access.
          </p>

          <p>
            Contacts Remaining:
            {" "}
            {user.subscription.freeContactsRemaining}
          </p>

          <p>
            Valid Till:
            {" "}
            {new Date(
              user.subscription.expiresAt
            ).toLocaleDateString()}
          </p>

        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">

      <h1 className="text-3xl font-bold text-center mb-10">
        Upgrade to Premium 🚀
      </h1>


      <div className="max-w-md mx-auto bg-white rounded-xl shadow p-8 text-center">

        <h2 className="text-xl font-bold">
          Basic Monthly
        </h2>

        <p className="text-4xl font-bold my-6">
          ₹99
        </p>


        <CashfreePaymentButton />


      </div>

    </div>
  );
}
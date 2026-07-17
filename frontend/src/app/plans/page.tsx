"use client";

import { useEffect } from "react";
import CashfreePaymentButton from "@/src/components/CashfreePaymentButton";
import { useAuth } from "@/src/context/AuthContext";


export default function PlansPage() {


const {
user,

}=useAuth();

useEffect(()=>{



},[]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Please login to continue
      </div>
    );
  }


//  if (
//   user.subscription?.status === "premium" &&
//   user.subscription?.freeContactsRemaining > 0 &&
//   new Date(user.subscription.expiresAt) > new Date()
// ) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="bg-green-100 p-8 rounded-xl text-center">

//           <h1 className="text-2xl font-bold text-green-700">
//             🎉 Premium Active
//           </h1>

//           <p className="mt-3">
//             You already have premium access.
//           </p>

//           <p>
//             Contacts Remaining:
//             {" "}
//             {user.subscription.premiumContactsRemaining}
//           </p>

//           <p>
//             Valid Till:
//             {" "}
//             {new Date(
//               user.subscription.expiresAt
//             ).toLocaleDateString()}
//           </p>

//         </div>
//       </div>
//     );
//   }

if (
  user.subscription?.status === "premium" &&
  user.subscription?.freeContactsRemaining <= 0
) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-red-100 p-8 rounded-xl text-center">

        <h1 className="text-2xl font-bold text-red-700">
          Contact Limit Finished
        </h1>

        <p className="mt-3">
          Your 10 premium contacts have been used.
        </p>

        <p className="mt-2">
          Purchase a new plan to continue.
        </p>

        <div className="mt-6">
          <CashfreePaymentButton />
        </div>

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
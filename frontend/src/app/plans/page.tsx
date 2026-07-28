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
    // <div className="min-h-screen bg-gray-50 py-16 px-6">

    //   <h1 className="text-3xl font-bold text-center mb-10">
    //     Upgrade to Premium 🚀
    //   </h1>


    //   <div className="max-w-md mx-auto bg-white rounded-xl shadow p-8 text-center">

    //     <h2 className="text-xl font-bold">
    //       Basic Monthly
    //     </h2>

    //     <p className="text-4xl font-bold my-6">
    //       ₹99
    //     </p>


    //     <CashfreePaymentButton />


    //   </div>

    // </div>
    <div className="min-h-screen bg-[#F7F5F1] py-16 px-6">

  <div className="max-w-lg mx-auto">


    {/* Heading */}
    <div className="text-center mb-10">


      <div className="
        inline-flex
        px-5
        py-2
        rounded-full
        bg-[#E8F0E9]
        text-[#3F6248]
        text-sm
        font-medium
      ">
        Premium Membership
      </div>



      <h1 className="
        mt-6
        text-4xl
        font-bold
        text-[#1E2420]
        tracking-tight
      ">
        Find Your Perfect Home
      </h1>



      <p className="
        mt-3
        text-gray-500
        text-lg
      ">
        Connect directly with property owners
      </p>


    </div>






    {/* Premium Card */}
    <div className="
      bg-white
      rounded-[32px]
      overflow-hidden
      shadow-[0_25px_70px_rgba(0,0,0,0.08)]
      border
      border-[#E9E4DA]
    ">





      {/* Top Premium Area */}
      <div className="
        bg-[#050c05]
        px-8
        py-10
        text-white
      ">


        <p className="
          text-xs
          uppercase
          tracking-[0.3em]
          text-gray-300
        ">
          GharDestiny Premium
        </p>



        <h2 className="
          mt-5
          text-3xl
          font-semibold
        ">
          Home Access
        </h2>



       <div className="
  mt-7
  flex
  items-end
  justify-center
  gap-2
">

  <span className="
    text-5xl
    font-bold
  ">
    ₹99
  </span>


  <span className="
    text-gray-300
    mb-2
    
  ">
    / 30 days
  </span>


</div>



      </div>







      {/* Content */}
      <div className="p-8">





        {/* Validity */}
        <div className="
          bg-[#FAF7F0]
          rounded-2xl
          p-5
          border
          border-[#E9DFC8]
        ">


          <p className="
            text-sm
            text-gray-500
          ">
            Membership validity
          </p>


          <div className="
            mt-2
            flex
            justify-between
            items-center
          ">


            <p className="
              text-lg
              font-semibold
              text-[#252A25]
            ">
              30 Days Premium Access
            </p>


            <div className="
              w-10
              h-10
              rounded-full
              bg-[#DDE9DF]
              flex
              items-center
              justify-center
              text-[#3F6248]
              font-bold
            ">
              ✓
            </div>


          </div>


        </div>








        {/* Features */}
        <div className="mt-8">


          <h3 className="
            font-semibold
            text-[#202820]
            mb-5
          ">
            Premium Benefits
          </h3>



          <div className="space-y-5">


            {[
              "10 owner contact unlocks",
              "View owner phone & email",
              "Direct communication with owners",
              "Faster home search experience"
            ].map((item)=>(


              <div
                key={item}
                className="
                  flex
                  items-center
                  gap-4
                "
              >


                <div className="
                  w-8
                  h-8
                  rounded-full
                  bg-[#E8F0E9]
                  flex
                  items-center
                  justify-center
                  text-[#3F6248]
                  font-bold
                ">
                  ✓
                </div>



                <p className="
                  text-gray-700
                ">
                  {item}
                </p>



              </div>


            ))}


          </div>


        </div>








        {/* Payment */}
      <div className="mt-10 flex justify-center">
  <CashfreePaymentButton />
</div>





        <p className="
          mt-6
          text-center
          text-xs
          text-gray-400
        ">
          🔒 Secure payment • Instant activation • Expires after 30 days
        </p>



      </div>


    </div>


  </div>


</div>
  );
}
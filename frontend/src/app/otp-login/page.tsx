"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  useAuth,
} from "@/src/context/AuthContext";

import {
  API,
} from "@/src/lib/api";




export default function OTPLogin() {

  const router = useRouter();

  const {
    fetchUser,
  } = useAuth();


  const [phone, setPhone] =
    useState("");

  const [loading, setLoading] =
    useState(false);



  useEffect(() => {

    const script =
      document.createElement("script");


    script.src =
      "https://verify.msg91.com/otp-provider.js";


    script.async = true;


    document.body.appendChild(script);



    return () => {

      document.body.removeChild(script);

    };


  }, []);





  const loginUser = async () => {

    try {


      const res =
        await fetch(
          API.otpLogin,
          {
            method:"POST",

            credentials:"include",

            headers:{
              "Content-Type":
              "application/json",
            },

            body:JSON.stringify({
              phone,
            }),

          }
        );



      const data =
        await res.json();



      if(!res.ok){

        alert(data.message);

        return false;

      }



      // Update AuthContext

      await fetchUser();


      return true;



    }
    catch(error){

      console.log(
        "OTP LOGIN ERROR",
        error
      );

      return false;

    }

  };







  const startOTP = () => {


    if(phone.length !== 10){

      alert(
        "Enter valid 10 digit mobile number"
      );

      return;

    }



    if(!window.initSendOTP){

      alert(
        "MSG91 not loaded"
      );

      return;

    }




    window.initSendOTP({

      widgetId:
      process.env.NEXT_PUBLIC_MSG91_WIDGET_ID,


      tokenAuth:
      process.env.NEXT_PUBLIC_MSG91_TOKEN_AUTH,


     identifier: `91${phone}`,



      success: async(data:any)=>{


        console.log(
          "MSG91 Success",
          data
        );


        try{


          setLoading(true);



          // Step 1: Verify OTP

          const verifyRes =
            await fetch(
              API.verifyOTP,
              {

                method:"POST",

                credentials:"include",

                headers:{
                  "Content-Type":
                  "application/json",
                },

                body:JSON.stringify({

                  phone,

                  msg91Response:data,

                }),

              }
            );



          const verifyData =
            await verifyRes.json();



          if(!verifyRes.ok){

            alert(
              verifyData.message
            );

            return;

          }





          // Step 2: Login user

          const loggedIn =
            await loginUser();



          if(loggedIn){

            router.push("/");

          }



        }
        catch(error){

          console.log(
            error
          );

          alert(
            "Login failed"
          );


        }
        finally{

          setLoading(false);

        }


      },



      failure:(error:any)=>{


        console.log(
          "MSG91 ERROR",
          error
        );


        alert(
          "OTP verification failed"
        );


      }


    });


  };







  return (

    <div className="
    min-h-screen
    flex
    items-center
    justify-center
    bg-gray-100
    px-4
    ">


      <div className="
      bg-white
      p-8
      rounded-xl
      shadow-xl
      w-full
      max-w-md
      ">


        <h1 className="
        text-3xl
        font-bold
        text-center
        mb-6
        ">

          Login With OTP

        </h1>




        <input

          value={phone}

          onChange={(e)=>
            setPhone(e.target.value.replace(/\D/g,""))
          }


          maxLength={10}


          placeholder="Enter mobile number"


          className="
          w-full
          border
          p-3
          rounded-lg
          mb-4
          "

        />





        <button

          onClick={startOTP}

          disabled={loading}


          className="
          w-full
          bg-orange-500
          hover:bg-orange-600
          text-white
          py-3
          rounded-lg
          font-semibold
          disabled:opacity-50
          "

        >

          {
            loading
            ?
            "Please wait..."
            :
            "Send OTP"
          }


        </button>



      </div>


    </div>

  );

}
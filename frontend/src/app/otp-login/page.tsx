"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

export default function OTPLogin() {

  const router = useRouter();

  const { setUser } = useAuth();


  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [step, setStep] = useState(1);

  const [timer, setTimer] = useState(0);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");



  const API =
    process.env.NEXT_PUBLIC_API_URL;



  // Countdown
  useEffect(()=>{

    if(timer <= 0) return;


    const interval = setInterval(()=>{

      setTimer(prev=>prev-1);

    },1000);


    return ()=>clearInterval(interval);


  },[timer]);




  const validatePhone = ()=>{

    const regex=/^[6-9]\d{9}$/;


    if(!phone){

      setError(
        "Phone number required"
      );

      return false;

    }


    if(!regex.test(phone)){

      setError(
        "Enter valid 10 digit phone number"
      );

      return false;

    }


    setError("");

    return true;

  };





  const sendOTP = async()=>{


    if(!validatePhone()) return;


    if(timer>0) return;


    try{


      setLoading(true);


      const res = await fetch(
        `${API}/auth/send-otp`,
        {

          method:"POST",

          credentials:"include",

          headers:{
            "Content-Type":"application/json"
          },


          body:JSON.stringify({

            phone

          })

        }
      );



      const data = await res.json();



      if(!res.ok){

        throw new Error(
          data.message || "OTP failed"
        );

      }



      alert(
        "OTP sent successfully"
      );


      setStep(2);

      setTimer(30);



    }
    catch(err:any){

      alert(
        err.message
      );

    }
    finally{

      setLoading(false);

    }


  };






  const verifyOTP = async()=>{


    if(!otp){

      setError(
        "Enter OTP"
      );

      return;

    }



    try{


      setLoading(true);



      const res = await fetch(
        `${API}/auth/verify-otp`,
        {

          method:"POST",

          credentials:"include",

          headers:{
            "Content-Type":"application/json"
          },


          body:JSON.stringify({

            phone,

            otp

          })

        }
      );



      const data =
        await res.json();




      if(!res.ok){

        throw new Error(
          data.message ||
          "Invalid OTP"
        );

      }



      setUser(
        data.user
      );



      router.push("/");



    }
    catch(err:any){

      alert(
        err.message
      );

    }
    finally{

      setLoading(false);

    }


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
      p-6
      rounded-2xl
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





        {step===1 && (

          <>

          <input

            type="text"

            placeholder="Enter phone number"

            value={phone}

            onChange={(e)=>{

              setPhone(e.target.value);

              setError("");

            }}

            className="
            w-full
            border
            rounded-xl
            p-3
            mb-3
            "

          />



          {error && (

            <p className="
            text-red-500
            text-sm
            mb-3
            ">
              {error}
            </p>

          )}



          <button

            onClick={sendOTP}

            disabled={loading || timer>0}

            className="
            w-full
            py-3
            rounded-xl
            bg-orange-500
            text-white
            font-semibold
            "

          >

            {
              loading
              ?
              "Sending..."
              :
              timer>0
              ?
              `Wait ${timer}s`
              :
              "Send OTP"
            }


          </button>


          </>

        )}







        {step===2 && (

          <>

          <input

            type="text"

            placeholder="Enter OTP"

            value={otp}

            onChange={(e)=>setOtp(e.target.value)}

            className="
            w-full
            border
            rounded-xl
            p-3
            mb-3
            "

          />



          <button

            onClick={verifyOTP}

            disabled={loading}

            className="
            w-full
            py-3
            rounded-xl
            bg-green-600
            text-white
            font-semibold
            "

          >

            {
              loading
              ?
              "Verifying..."
              :
              "Verify OTP"
            }

          </button>





          <button

            onClick={sendOTP}

            disabled={timer>0}

            className="
            w-full
            mt-3
            py-3
            border
            rounded-xl
            "

          >

            {
              timer>0
              ?
              `Resend OTP ${timer}s`
              :
              "Resend OTP"
            }


          </button>


          </>

        )}



      </div>


    </div>

  );

}
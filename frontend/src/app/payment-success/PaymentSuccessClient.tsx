"use client";

import {
useEffect
} from "react";

import {
useRouter
} from "next/navigation";



export default function PaymentSuccessClient(){


const router=useRouter();



useEffect(()=>{


setTimeout(()=>{


alert(
"Payment successful 🎉 Premium activation in progress"
);


router.push("/");


},2000);



},[]);



return(

<div className="
min-h-screen
flex
items-center
justify-center
">

<h1 className="text-2xl font-bold">

Payment Successful...

</h1>


</div>

);


}
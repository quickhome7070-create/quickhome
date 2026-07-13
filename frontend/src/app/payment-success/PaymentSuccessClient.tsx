"use client";

import {
useEffect
} from "react";

import {
useRouter,
useSearchParams
} from "next/navigation";


export default function PaymentSuccessClient(){


const router = useRouter();

const params = useSearchParams();



useEffect(()=>{


const verifyPayment = async()=>{


const orderId =
params.get("order_id");

console.log("VERIFY ORDER ID:", orderId);

if(!orderId)
return;



const res =
await fetch(

`${process.env.NEXT_PUBLIC_API_URL}/payment/verify`,

{
method:"POST",

headers:{
"Content-Type":
"application/json"
},

credentials:"include",

body:JSON.stringify({

orderId

})

}

);



const data =
await res.json();



console.log(
"VERIFY RESPONSE",
data
);



if(data.success){
console.log("VERIFY RESPONSE:", data);

alert(
"Premium Activated 🎉"
);


// reload user session

router.push("/");

router.refresh();


}

else{


alert(
"Payment not completed"
);


}



};



verifyPayment();



},[]);



return(

<div className="
min-h-screen
flex
items-center
justify-center
">

<h1 className="
text-2xl
font-bold
">

Verifying payment...

</h1>


</div>

);

}
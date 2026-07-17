"use client";


import {
useEffect,
useState
}
from "react";


import {
useRouter
}
from "next/navigation";


import {
useAuth
}
from "@/src/context/AuthContext";
import { API } from "@/src/lib/api";




export default function OTPLogin(){



const router =
useRouter();



const {
fetchUser
}=useAuth();




const [phone,setPhone]
=
useState("");



const [loading,setLoading]
=
useState(false);









useEffect(()=>{


const script =
document.createElement("script");


script.src =
"https://verify.msg91.com/otp-provider.js";


script.async=true;


document.body.appendChild(script);



return ()=>{

document.body.removeChild(script);

};


},[]);





const startOTP = ()=>{


if(phone.length!==10){

alert(
"Enter valid mobile number"
);

return;

}




window.initSendOTP({

widgetId:
process.env
.NEXT_PUBLIC_MSG91_WIDGET_ID,


tokenAuth:
process.env
.NEXT_PUBLIC_MSG91_TOKEN_AUTH,



identifier:
phone,



success: async(data:any)=>{

console.log(
"OTP Success",
data
);


try{


const res =
await fetch(

API.verifyOTP,

{

method:"POST",

headers:{
"Content-Type":"application/json"
},

credentials:"include",

body:JSON.stringify({

phone,

msg91Response:data

})

}

);



const result =
await res.json();



if(!res.ok){

alert(result.message);

return;

}



// refresh logged-in user

await fetchUser();



router.push("/");


}
catch(error:any){

console.log(
error
);

alert(
"OTP login failed"
);

}


},

failure: (error: any) => {

  console.log(error);

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

onChange={
e=>setPhone(e.target.value)
}


placeholder="Mobile number"


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
text-white
py-3
rounded-lg
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
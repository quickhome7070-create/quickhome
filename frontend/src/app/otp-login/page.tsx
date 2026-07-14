"use client";


import {
useEffect,
useState
} from "react";


import {
useRouter
} from "next/navigation";


import {
useAuth
} from "@/src/context/AuthContext";




export default function OTPLogin(){



const router =
useRouter();


const {
setUser
}=useAuth();



const [phone,setPhone]
=
useState("");



const [loading,setLoading]
=
useState(false);



const API =
process.env.NEXT_PUBLIC_API_URL;





useEffect(()=>{


if(!window)
return;



const script =
document.createElement("script");


script.src =
"https://verify.msg91.com/otp-provider.js";


script.async=true;



script.onload=()=>{


console.log(
"MSG91 loaded"
);


};



document.body.appendChild(script);



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



success:

async(data:any)=>{


console.log(
"OTP Success",
data
);



loginUser();



},




failure:(error:any)=>{


console.log(error);


alert(
"OTP verification failed"
);


}



});



};







const loginUser =
async()=>{


try{


setLoading(true);



const res =
await fetch(

`${API}/auth/msg91-login`,

{


method:"POST",


credentials:"include",


headers:{


"Content-Type":
"application/json"

},


body:JSON.stringify({

phone

})


}

);




const data =
await res.json();



if(res.ok){


setUser(
data.user
);


router.push("/");


}

else{


alert(
data.message
);


}




}

catch(error){


alert(
"Login failed"
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
">


<div className="
bg-white
p-8
rounded-xl
shadow-lg
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


className="
border
w-full
p-3
rounded-lg
mb-4
"



placeholder="Enter mobile number"


value={phone}



onChange={
e=>
setPhone(e.target.value)
}


/>



<button


disabled={loading}


onClick={startOTP}



className="
w-full
bg-orange-500
text-white
py-3
rounded-lg
font-semibold
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
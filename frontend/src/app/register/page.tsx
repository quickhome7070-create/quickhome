"use client";


import {
  useEffect,
  useState
} from "react";


import {
  useRouter
} from "next/navigation";


import Link from "next/link";


import {
  API
} from "@/src/lib/api";
import { useAuth } from "@/src/context/AuthContext";









export default function RegisterPage(){


const router = useRouter();

const {
setUser,
fetchUser
}=useAuth();



const [form,setForm] =
useState({

name:"",
email:"",
phone:"",
password:""

});



const [loading,setLoading] =
useState(false);



const [msg91Loaded,setMsg91Loaded] =
useState(false);



const [showPassword,setShowPassword] =
useState(false);



const [errors,setErrors] =
useState({

name:"",
email:"",
phone:"",
password:""

});






// Load MSG91 Widget

useEffect(()=>{


const script =
document.createElement("script");


script.src =
"https://verify.msg91.com/otp-provider.js";


script.async=true;



script.onload=()=>{

console.log(
"MSG91 Loaded"
);

setMsg91Loaded(true);

};



document.body.appendChild(script);



return()=>{

document.body.removeChild(script);

};


},[]);









const validateForm=()=>{


let valid=true;


const newErrors={

name:"",
email:"",
phone:"",
password:""

};





if(!form.name.trim()){

newErrors.name =
"Name required";

valid=false;

}




const emailRegex =
/^[^\s@]+@[^\s@]+\.[^\s@]+$/;



if(!emailRegex.test(form.email)){


newErrors.email =
"Valid email required";

valid=false;

}





const phoneRegex =
/^[6-9]\d{9}$/;



if(!phoneRegex.test(form.phone)){


newErrors.phone =
"Valid phone required";

valid=false;


}





const passwordRegex =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;



if(!passwordRegex.test(form.password)){


newErrors.password =
"Password must contain uppercase, lowercase, number and special character";


valid=false;


}



setErrors(newErrors);


return valid;


};









// Register API

const registerUser =
async()=>{


try{


setLoading(true);



const res =
await fetch(

API.register,

{

method:"POST",

headers:{

"Content-Type":
"application/json"

},

credentials:"include",


body:JSON.stringify(form)

}

);





const data =
await res.json();





if(!res.ok){


throw new Error(
data.message
);


}







await fetchUser();


router.push("/");



}
catch(error:any){


console.log(
"REGISTER ERROR",
error
);


alert(
error.message
);


}
finally{


setLoading(false);


}


};









// Verify OTP

const verifyPhone =
()=>{


if(!validateForm()){

return;

}



if(!msg91Loaded){


alert(
"OTP loading..."
);


return;

}






window.initSendOTP?.({

widgetId:

process.env
.NEXT_PUBLIC_MSG91_WIDGET_ID,



tokenAuth:

process.env
.NEXT_PUBLIC_MSG91_TOKEN_AUTH,



identifier:`91${form.phone}`,





success:

async(data:any)=>{


console.log(
"OTP SUCCESS",
data
);






// Backend OTP verification


const verifyRes =
await fetch(

API.verifyOTP,

{

method:"POST",


headers:{

"Content-Type":
"application/json"

},


body:JSON.stringify({

phone:
form.phone,


msg91Response:
data

})

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






// Create account

await registerUser();



},






failure:

(error:any)=>{


console.log(
error
);


alert(
"OTP failed"
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
">

Create Account

</h1>





<div className="
space-y-4
mt-6
">






<input

className="
w-full
border
rounded-xl
p-3
"

placeholder="Full name"


value={form.name}


onChange={(e)=>

setForm({

...form,

name:e.target.value

})

}

/>


<p className="text-red-500 text-sm">

{errors.name}

</p>








<input

className="
w-full
border
rounded-xl
p-3
"

placeholder="Email"


value={form.email}


onChange={(e)=>

setForm({

...form,

email:e.target.value

})

}

/>



<p className="text-red-500 text-sm">

{errors.email}

</p>









<input

className="
w-full
border
rounded-xl
p-3
"

placeholder="Phone number"


value={form.phone}


onChange={(e)=>

setForm({

...form,

phone:e.target.value

})

}

/>


<p className="text-red-500 text-sm">

{errors.phone}

</p>









<div className="relative">


<input

type={
showPassword
?
"text"
:
"password"
}

className="
w-full
border
rounded-xl
p-3
"

placeholder="Password"


value={form.password}


onChange={(e)=>

setForm({

...form,

password:e.target.value

})

}

/>



<button

type="button"

onClick={()=>
setShowPassword(!showPassword)
}

className="
absolute
right-3
top-3
"

>

  {showPassword ? (
      // Eye Off
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3l18 18"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.584 10.587a2 2 0 102.829 2.829"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.88 5.09A9.953 9.953 0 0112 5c5 0 9 7 9 7a17.3 17.3 0 01-2.164 2.94M6.228 6.228C4.312 7.526 3 9.5 3 9.5s4 7 9 7a8.96 8.96 0 004.773-1.228"
        />
      </svg>
    ) : (
      // Eye
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12z"
        />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )}


</button>


</div>


<p className="text-red-500 text-sm">

{errors.password}

</p>







</div>







<button

onClick={verifyPhone}

disabled={loading}


className="
w-full
mt-6
bg-orange-500
text-white
py-3
rounded-xl
font-semibold
disabled:opacity-50
"

>


{
loading
?
"Creating Account..."
:
"Sign Up"
}


</button>







<p className="
text-center
mt-5
text-sm
">


Already have account?


<Link

href="/login"

className="
text-orange-600
font-semibold
"

>

Login

</Link>


</p>




</div>


</div>


);


}
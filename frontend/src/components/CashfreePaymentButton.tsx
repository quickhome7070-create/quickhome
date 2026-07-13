"use client";


import {
useState
} from "react";



export default function CashfreePaymentButton(){


const [loading,setLoading]=useState(false);



const payNow=async()=>{


try{


setLoading(true);



const res =
await fetch(

`${process.env.NEXT_PUBLIC_API_URL}/payment/create-order`,

{

method:"POST",

credentials:"include"

}

);



const data =
await res.json();



if(!data.success){

alert(data.message);

return;

}



const {
load
}=await import(
"@cashfreepayments/cashfree-js"
);



const cashfree =
await load({

mode:"production"

});



await cashfree.checkout({

paymentSessionId:
data.paymentSessionId,


redirectTarget:"_self"

});



}
catch(error){

console.log(error);

alert(
"Payment failed"
);

}

finally{

setLoading(false);

}


};



return(

<button

onClick={payNow}

disabled={loading}

className="
bg-green-600
text-white
px-6
py-3
rounded-xl
"

>


{
loading
?
"Processing..."
:
"Pay Now"
}


</button>

);


}
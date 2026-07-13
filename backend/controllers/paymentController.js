const {
 Cashfree,
 CFEnvironment
}=require("cashfree-pg");


const User =
require("../models/User");


const Payment =
require("../models/Payment");


const crypto =
require("crypto");



const cashfree =
new Cashfree(
 CFEnvironment.PRODUCTION
);



cashfree.XClientId =
process.env.CASHFREE_APP_ID;


cashfree.XClientSecret =
process.env.CASHFREE_SECRET_KEY;



console.log(
"Cashfree Production Loaded"
);



// =================================
// CREATE ORDER
// =================================


exports.createOrder =
async(req,res)=>{


try{


const user =
await User.findById(
 req.user.userId
);



if(!user){

return res.status(404).json({

success:false,

message:"User not found"

});

}



if(

user.subscription.status==="premium" &&

user.subscription.expiresAt > new Date()

){


return res.status(400).json({

success:false,

message:"Premium already active"

});


}



const orderId =
`order_${Date.now()}`;



// SAVE PAYMENT FIRST

await Payment.create({

orderId,

userId:user._id,

amount:99

});





const response =
await cashfree.PGCreateOrder({


order_id:orderId,


order_amount:99,


order_currency:"INR",



customer_details:{


customer_id:
user._id.toString(),


customer_name:
user.name,


customer_email:
user.email || "test@test.com",


customer_phone:
user.phone || "9999999999"


},



order_meta:{


return_url:
`https://ghardestiny.com/payment-success?order_id=${orderId}`,


notify_url:
"https://api.ghardestiny.com/api/payment/cashfree-webhook"


}



});




return res.json({

success:true,

paymentSessionId:
response.data.payment_session_id

});




}
catch(error){


console.log(
"CREATE ORDER ERROR",
error.response?.data ||
error.message
);



return res.status(500).json({

success:false,

message:"Unable to create order"

});


}


};




// =================================
// CASHFREE WEBHOOK
// =================================


exports.cashfreeWebhook =
async(req,res)=>{


try{


console.log(
"========== CASHFREE WEBHOOK HIT =========="
);



const signature =
req.headers["x-webhook-signature"];


const timestamp =
req.headers["x-webhook-timestamp"];



const body =
req.body.toString("utf8");



const expected =
crypto
.createHmac(

"sha256",

process.env.CASHFREE_WEBHOOK_SECRET

)

.update(
timestamp + body
)

.digest("base64");



if(signature!==expected){

console.log(
"Invalid signature"
);


return res.status(401).send(
"Invalid"
);


}



const event =
JSON.parse(body);



console.log(
"EVENT:",
event.type
);




const payment =
event?.data?.payment;



if(
!payment ||
payment.payment_status!=="SUCCESS"
){

return res.json({
received:true
});

}



const orderId =
event.data.order.order_id;



const paymentRecord =
await Payment.findOne({

orderId

});



if(!paymentRecord){

console.log(
"Payment record missing"
);


return res.json({
received:true
});

}



const userId =
paymentRecord.userId;



const updatedUser =
await User.findByIdAndUpdate(

userId,


{

"subscription.status":
"premium",


"subscription.freeContactsRemaining":
10,


"subscription.expiresAt":

new Date(

Date.now()
+
30*24*60*60*1000

)

},


{
new:true
}

);




await Payment.findOneAndUpdate(

{
orderId
},

{
status:"PAID"
}

);




console.log(
"PREMIUM ACTIVATED",
updatedUser.subscription
);



return res.json({

received:true

});



}
catch(error){


console.log(
"WEBHOOK ERROR",
error
);


return res.status(500).send(
"Webhook error"
);


}


};
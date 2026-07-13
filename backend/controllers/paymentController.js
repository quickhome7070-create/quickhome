const {
  Cashfree,
  CFEnvironment
} = require("cashfree-pg");

const crypto = require("crypto");
const User = require("../models/User");


// ===============================
// CASHFREE PRODUCTION INIT
// ===============================

const cashfree = new Cashfree(
  CFEnvironment.PRODUCTION
);


cashfree.XClientId =
  process.env.CASHFREE_APP_ID;


cashfree.XClientSecret =
  process.env.CASHFREE_SECRET_KEY;


console.log("Cashfree Production Loaded");



// ===============================
// CREATE ORDER
// ===============================

exports.createOrder = async (req, res) => {

  try {

    const user =
      await User.findById(req.user.userId);


    if (!user) {

      return res.status(404).json({
        success:false,
        message:"User not found"
      });

    }



    // Already premium

    if (
      user.subscription.status === "premium" &&
      user.subscription.expiresAt > new Date()
    ) {

      return res.status(400).json({
        success:false,
        message:"Premium already active"
      });

    }



    const orderId =
      `order_${Date.now()}`;



    const response =
      await cashfree.PGCreateOrder({

        order_id: orderId,

        order_amount: 99,

        order_currency:"INR",


        customer_details: {

          customer_id:
            user._id.toString(),

          customer_name:
            user.name || "Customer",

          customer_email:
            user.email || "customer@example.com",

          customer_phone:
            user.phone || "9999999999"

        },


        order_meta: {

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
      "CREATE ORDER ERROR:",
      error.response?.data || error.message
    );


    return res.status(500).json({

      success:false,

      message:"Unable to create order"

    });

  }

};





// ===============================
// CASHFREE WEBHOOK
// ===============================


exports.cashfreeWebhook = async (req,res)=>{


console.log(
  "========== CASHFREE WEBHOOK HIT =========="
);


try{


const signature =
  req.headers["x-webhook-signature"];


const timestamp =
  req.headers["x-webhook-timestamp"];



if(
 !signature ||
 !timestamp
){

 console.log(
  "Missing webhook headers"
 );

 return res.status(400).send(
  "Missing headers"
 );

}




const body =
 req.body.toString("utf8");



// Signature verification

const expectedSignature =
crypto
.createHmac(
 "sha256",
 process.env.CASHFREE_SECRET_KEY
)
.update(
 timestamp + body
)
.digest("base64");




if(signature !== expectedSignature){

 console.log(
  "Invalid webhook signature"
 );

 return res.status(401).send(
  "Invalid signature"
 );

}




const event =
JSON.parse(body);



console.log(
 "CASHFREE EVENT:",
 event.event
);



const order =
event?.data?.order;



if(!order){

 console.log(
  "Order data missing"
 );

 return res.json({
  received:true
 });

}




if(
 order.order_status === "PAID"
){


const userId =
 order.customer_details?.customer_id;



if(!userId){

 console.log(
  "User ID missing"
 );

 return res.json({
  received:true
 });

}



const user =
await User.findById(userId);



if(!user){

 console.log(
  "User not found:",
  userId
 );

 return res.json({
  received:true
 });

}



// prevent duplicate activation

if(
 user.subscription.status === "premium" &&
 user.subscription.expiresAt > new Date()
){

 console.log(
  "Already premium"
 );

 return res.json({
  received:true
 });

}




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
 30 *
 24 *
 60 *
 60 *
 1000
)

},

{
 new:true
}

);



console.log(
 "PREMIUM ACTIVATED:",
 updatedUser.subscription
);



}



return res.json({

received:true

});



}
catch(error){


console.log(
 "WEBHOOK ERROR:",
 error
);


return res.status(500).send(
 "Webhook error"
);


}

};
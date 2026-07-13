const { Cashfree, CFEnvironment } = require("cashfree-pg");
const crypto = require("crypto");
const User = require("../models/User");

// =========================
// CASHFREE INIT (CLEAN)
// =========================

const cashfree = new Cashfree(
  process.env.CASHFREE_ENV === "production"
    ? CFEnvironment.PRODUCTION
    : CFEnvironment.SANDBOX
);

cashfree.XClientId = process.env.CASHFREE_APP_ID;
cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;

// ADD THESE LOGS HERE
console.log("Cashfree App ID:", process.env.CASHFREE_APP_ID);
console.log("Cashfree Env:", process.env.CASHFREE_ENV);
console.log(
  "Secret Prefix:",
  process.env.CASHFREE_SECRET_KEY?.substring(0, 15)
);



// =========================
// CREATE ORDER
// =========================

exports.createOrder = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if(!user){

return res.status(404).json({
success:false,
message:"User not found"
});

}
    if(
 user.subscription.status === "premium" &&
 user.subscription.expiresAt > new Date()
){
 return res.status(400).json({
   success:false,
   message:"Premium already active"
 });
}

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const orderId = `order_${Date.now()}`;

    const response = await cashfree.PGCreateOrder({
      order_id: orderId,
      // order_amount: 99,
      order_amount: 10,
      order_currency: "INR",

      customer_details: {
        customer_id: user._id.toString(),
        customer_name: user.name || "Customer",
        customer_email: user.email || "customer@example.com",
        customer_phone: user.phone || "9999999999",
      },

      order_meta: {
        return_url: `https://ghardestiny.com/payment-success?order_id=${orderId}`,
         notify_url:  "https://api.ghardestiny.com/api/payment/cashfree-webhook",
      },
  //      order_meta: {
  //   return_url:
  //     "https://nerveless-vespine-marcellus.ngrok-free.dev/payment-success?order_id={order_id}",
  // },
    });

    return res.json({
      success: true,
      paymentSessionId: response.data.payment_session_id,
      orderId: response.data.order_id,
    });

  } catch (error) {
    console.error(
      "Cashfree Create Order Error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to create order",
    });
  }
};

// =========================
// VERIFY PAYMENT (OPTIONAL ONLY)
// =========================

exports.verifyPayment = async(req,res)=>{
try{

const {orderId}=req.body;

console.log("VERIFY ORDER:",orderId);


const response =
 await cashfree.PGFetchOrder(
 "2023-08-01",
 orderId
 );


const order=response.data;


console.log(order);


if(order.order_status !== "PAID"){
 return res.json({
  success:false,
  status:order.order_status
 });
}


const userId =
order.customer_details.customer_id;


const user =
await User.findByIdAndUpdate(
 userId,
 {
  "subscription.status":"premium",
  "subscription.freeContactsRemaining":10,
  "subscription.expiresAt":
   new Date(
    Date.now()+30*24*60*60*1000
   )
 },
 {
  new:true
 }
);


console.log(
"UPDATED USER:",
user.subscription
);


return res.json({
 success:true
});


}
catch (error) {

  console.log("========== VERIFY ERROR ==========");
  console.log("Order ID:", req.body.orderId);
  console.log("Status:", error.response?.status);
  console.log("Data:", error.response?.data);
  console.log("Message:", error.message);
  console.log(
    "Full Error:",
    JSON.stringify(error.response?.data, null, 2)
  );
  console.log("==================================");

  return res.status(500).json({
    success: false,
    message: "Verification failed",
  });

}
};

// =========================
// CASHFREE WEBHOOK (FINAL CLEAN)
// =========================

exports.cashfreeWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-webhook-signature"];
    const timestamp = req.headers["x-webhook-timestamp"];

    if (!signature || !timestamp) {
      return res.status(400).send("Missing headers");
    }

    const body = req.body.toString("utf8");

    // =========================
    // SIGNATURE VERIFY
    // =========================
    const expectedSignature = crypto
      .createHmac("sha256", process.env.CASHFREE_WEBHOOK_SECRET)
      .update(timestamp + body)
      .digest("base64");

    if (
      !crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      )
    ) {
      return res.status(401).send("Invalid signature");
    }

    const event = JSON.parse(body);
    const order = event?.data?.order;

    if (!order) return res.json({ received: true });

    // =========================
    // PAYMENT SUCCESS
    // =========================
    if (order.order_status === "PAID") {
      const userId = order.customer_details?.customer_id;

      if (!userId) return res.json({ received: true });

      const user = await User.findById(userId);

      if (!user) return res.json({ received: true });

      // idempotency
      if (user.subscription?.status === "premium" &&
         user.subscription.expiresAt > new Date()) {
        return res.json({ received: true });
      }

    const updatedUser = await User.findByIdAndUpdate(
  userId,
  {
    "subscription.status": "premium",
    "subscription.freeContactsRemaining": 10,
    "subscription.expiresAt": new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ),
  },
  { new: true }
);

      console.log("✅ Subscription Activated:", userId);
      console.log(
  "Updated Subscription:",
  updatedUser.subscription
);
    }

    return res.json({ received: true });

  } catch (err) {
    console.error("Webhook Error:", err);
    return res.status(500).send("Webhook Error");
  }
};
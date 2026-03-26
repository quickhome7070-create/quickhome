const crypto = require("crypto");
const User = require("../models/User");

exports.razorpayWebhook = async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (signature !== expected) {
    return res.status(400).send("Invalid signature");
  }

  const event = req.body;

  // 🔥 CHANGE THIS (important)
  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;

    const userId = payment.notes?.userId;

    if (!userId) {
      console.log("No userId in notes");
      return res.json({ received: true });
    }

    await User.findByIdAndUpdate(userId, {
      "subscription.status": "active",
      "subscription.isActive": true,
      "subscription.freeContactsRemaining": 10, // 🔥 FIX
    });

    console.log("🔥 WEBHOOK UPDATED USER:", userId);
  }

  res.json({ received: true });
};

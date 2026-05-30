const crypto = require("crypto");
const User = require("../models/User");

exports.razorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(req.body)
      .digest("hex");

    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );

    if (!isValid) {
      return res.status(400).send("Invalid signature");
    }

    const event = JSON.parse(req.body.toString());

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;

      const userId = payment.notes?.userId;

      if (!userId) {
        return res.json({ received: true });
      }

      await User.findByIdAndUpdate(userId, {
        "subscription.status": "active",
        "subscription.isActive": true,
        "subscription.freeContactsRemaining": 10,
      });

      console.log("Activated:", userId);
    }

    res.json({ received: true });
  } catch (err) {
    console.error(err);
    res.status(500).send("Webhook Error");
  }
};
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const amount = req.body?.amount;

    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
      notes: {
        userId: req.user.userId,
      },
    });

    console.log("Order userId:", req.user.userId);

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// controllers/razorpayController.js

exports.activateSubscription = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { razorpay_subscription_id } = req.body;

    await User.findByIdAndUpdate(userId, {
      "subscription.status": "active",
      "subscription.isActive": true,
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

exports.webhookHandler = async (req, res) => {
  res.send("Webhook working");
};

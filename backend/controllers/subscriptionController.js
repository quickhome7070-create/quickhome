const Razorpay = require("razorpay");
const User = require("../models/User");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


exports.startTrial = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent multiple trials
    if (user.subscription?.status === "trial") {
      return res.status(400).json({ message: "Trial already active" });
    }

 // 🔥 AUTO START TRIAL IF INACTIVE
if (!user.subscription) {
  user.subscription = {
    status: "trial",
    isActive: true,
    trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    freeContactsRemaining: 3,
    viewedProperties: [],
  };

  await user.save();
}

  

    res.json({ message: "Trial started successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const crypto = require("crypto");

exports.activatePaidPlan = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // 🔐 Verify payment
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment" });
    }

    // ✅ Activate plan
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        "subscription.status": "active",
        "subscription.isActive": true,
        "subscription.trialEndsAt": expiry,
        "subscription.freeContactsRemaining": 10, // 🔥 FIX
      },
      { new: true }
    );

    console.log("✅ PAID ACTIVATED:", updatedUser.subscription);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Activation failed" });
  }
};

exports.createOrder = async (req, res) => {
  const order = await razorpay.orders.create({
  amount: 100 * 99,
  currency: "INR",
  receipt: "receipt_" + Date.now(),
  notes: {
    userId: req.user.userId, // 🔥 MUST
  },
});

  res.json(order);
};
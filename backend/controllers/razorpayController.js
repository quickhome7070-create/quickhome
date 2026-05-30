const Razorpay = require("razorpay");
const crypto = require("crypto");

const User = require("../models/User");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// =========================
// CREATE ORDER
// =========================
exports.createOrder = async (req, res) => {
  try {

    const amount = req.body?.amount;

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is required",
      });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: req.user.userId,
      },
    });

    res.json(order);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Order creation failed",
    });
  }
};


// =========================
// VERIFY PAYMENT
// =========================
exports.verifyPayment = async (req, res) => {
  try {

    const userId = req.user.userId;

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing payment details",
      });
    }

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    const isValid = crypto.timingSafeEqual(
      Buffer.from(generatedSignature),
      Buffer.from(razorpay_signature)
    );

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // ✅ Activate premium immediately
    const expiry = new Date();

    expiry.setDate(expiry.getDate() + 30);

    await User.findByIdAndUpdate(userId, {
      "subscription.status": "active",
      "subscription.isActive": true,
      "subscription.expiresAt": expiry,
      "subscription.freeContactsRemaining": 10,
    });

    console.log("✅ PREMIUM ACTIVATED:", userId);

    res.json({
      success: true,
      message: "Payment verified successfully",
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
};


// =========================
// WEBHOOK
// =========================
exports.razorpayWebhook = async (req, res) => {
  try {

    const signature =
      req.headers["x-razorpay-signature"];

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_WEBHOOK_SECRET
      )
      .update(req.body)
      .digest("hex");

    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );

    if (!isValid) {
      return res.status(400).send("Invalid signature");
    }

    const event = JSON.parse(
      req.body.toString()
    );

    // ✅ Payment captured
    if (event.event === "payment.captured") {

      const payment =
        event.payload.payment.entity;

      const userId =
        payment.notes?.userId;

      if (!userId) {
        return res.json({
          received: true,
        });
      }

      const expiry = new Date();

      expiry.setDate(
        expiry.getDate() + 30
      );

      await User.findByIdAndUpdate(userId, {
        "subscription.status": "active",
        "subscription.isActive": true,
        "subscription.expiresAt": expiry,
        "subscription.freeContactsRemaining": 10,
      });

      console.log(
        "✅ WEBHOOK PREMIUM ACTIVATED:",
        userId
      );
    }

    res.json({
      received: true,
    });

  } catch (err) {

    console.error(err);

    res.status(500).send("Webhook Error");
  }
};
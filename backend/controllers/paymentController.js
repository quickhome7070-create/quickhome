const {
  Cashfree,
  CFEnvironment,
} = require("cashfree-pg");

const User = require("../models/User");

// =========================
// Cashfree Configuration
// =========================

const cashfree = new Cashfree(
  process.env.NODE_ENV === "production"
    ? CFEnvironment.PRODUCTION
    : CFEnvironment.SANDBOX
);

cashfree.XClientId =
  process.env.CASHFREE_APP_ID;

cashfree.XClientSecret =
  process.env.CASHFREE_SECRET_KEY;

// =========================
// Create Order
// =========================

exports.createOrder = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const response = await cashfree.PGCreateOrder({
      order_id: `order_${Date.now()}`,
      order_amount: 99,
      order_currency: "INR",

      customer_details: {
        customer_id: user._id.toString(),
        customer_name: user.name || "Customer",
        customer_email:
          user.email || "customer@example.com",
        customer_phone:
          user.phone || "9999999999",
      },

      order_meta: {
        return_url:
          "https://ghardestiny.com/payment-success?order_id={order_id}",
      },
    });

    return res.json({
      success: true,
      paymentSessionId:
        response.data.payment_session_id,
      orderId:
        response.data.order_id,
    });

  } catch (error) {
    console.error(
      "Cashfree Create Order Error:",
      error.response?.data || error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to create order",
    });
  }
};

// =========================
// Verify Payment
// =========================

exports.verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const response =
      await cashfree.PGFetchOrder(
        "2023-08-01",
        orderId
      );

    const order = response.data;

    if (order.order_status !== "PAID") {
      return res.json({
        success: false,
      });
    }

    const user = await User.findById(
      req.user.userId
    );

    user.subscription = {
      ...user.subscription,
      status: "premium",
      expiresAt: new Date(
        Date.now() +
        30 * 24 * 60 * 60 * 1000
      ),
    };

    await user.save();

    return res.json({
      success: true,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
    });
  }
};
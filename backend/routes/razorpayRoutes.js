const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createOrder,
  webhookHandler,
} = require("../controllers/razorpayController");

// ✅ Order API
router.post("/order/create", protect, createOrder);

// ✅ Webhook
router.post("/webhook", webhookHandler);

module.exports = router;
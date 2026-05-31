const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  createOrder,
  verifyPayment,
  cashfreeWebhook,
} = require("../controllers/paymentController");

// =========================
// CREATE ORDER (frontend calls this)
// =========================
router.post("/create-order", protect, createOrder);

// =========================
// OPTIONAL: manual verification (for fallback/debug only)
// =========================
router.post("/verify", protect, verifyPayment);

// =========================
// WEBHOOK (NO AUTH MIDDLEWARE)
// =========================
router.post(
  "/cashfree-webhook",
  express.raw({ type: "application/json" }),
  cashfreeWebhook
);

module.exports = router;
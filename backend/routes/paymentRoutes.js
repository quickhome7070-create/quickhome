const express = require("express");

const router = express.Router();


const {
  protect
} = require("../middleware/authMiddleware");


const {
  createOrder,
  verifyPayment
} = require("../controllers/paymentController");



router.post(
  "/create-order",
  protect,
  createOrder
);

router.get(
  "/verify/:orderId",
  protect,
  verifyPayment
);

module.exports = router;
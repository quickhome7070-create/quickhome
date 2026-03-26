const express = require("express");
const router = express.Router();

const { activatePaidPlan, startTrial } = require("../controllers/subscriptionController");
const { protect } = require("../middleware/authMiddleware"); // ✅ FIXED

router.post("/activate-paid", protect, activatePaidPlan);
router.post("/trial/start", protect, startTrial);

module.exports = router;
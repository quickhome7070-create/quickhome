const express = require("express");

const router = express.Router();

const {protect, adminOnly} = require("../middleware/authMiddleware");

const { isAdmin } = require("../middleware/adminMiddleware");

const {
  getPendingProperties,
  approveProperty,
  rejectProperty,
  getAdminStats,
   getApprovedProperties
} = require("../controllers/adminController");


// GET pending
router.get(
  "/pending",
  protect,
  isAdmin,
  getPendingProperties,
);


// APPROVE
router.put(
  "/approve/:id",
  protect,
  isAdmin,
  approveProperty
);


// REJECT
router.put(
  "/reject/:id",
  protect,
  isAdmin,
  rejectProperty,
 
);
router.get("/stats", protect, adminOnly, getAdminStats);
router.get("/approved", protect, adminOnly, getApprovedProperties);

module.exports = router;
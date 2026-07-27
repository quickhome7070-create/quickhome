const express = require("express");

const router = express.Router();

const {protect, adminOnly} = require("../middleware/authMiddleware");

const { isAdmin } = require("../middleware/adminMiddleware");

const {
  getPendingProperties,
  approveProperty,
  rejectProperty,
  getPendingEdits,
  getAdminStats,
   getApprovedProperties,
   approveEditRequest,
   getPendingEditRequests,
   rejectEditRequest
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
router.get(
  "/pending-edits",
  protect,
  adminOnly,
  getPendingEdits,
  
);
router.put(
 "/reject-edit/:id",
 protect,
 adminOnly,
 rejectEditRequest
);
router.put(
  "/approve-edit/:id",
  protect,
  adminOnly,
  approveEditRequest
);

module.exports = router;
const express = require("express");
const router = express.Router();

const {protect} = require("../middleware/authMiddleware");   // ✅ default import

const {
  register,
  login,
  getMe,
  logout,
  resetPassword,
  forgotPassword,
} = require("../controllers/authController");

// ROUTES
router.post("/register", register);
router.post("/login", login);
 router.get("/me", protect, getMe);   // protect must be FUNCTION
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.post("/logout", logout);

module.exports = router;

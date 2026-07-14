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
const {
 sendOTP,
 verifyOTP
} = require("../controllers/otpController");
const {
msg91Verify
}=require("../controllers/msg91Controller");



// ROUTES
router.post("/register", register);
router.post("/login", login);
router.post("/send-otp", sendOTP);
router.post(
"/msg91-verify",
msg91Verify
);


router.post("/verify-otp", verifyOTP);
 router.get("/me", protect, getMe);   // protect must be FUNCTION
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.post("/logout", logout);

module.exports = router;

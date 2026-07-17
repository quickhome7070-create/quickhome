const express = require("express");

const router = express.Router();


const {
  register,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword
} =
require("../controllers/authController");
const {
 loginWithOTP
}
=
require("../controllers/otpLoginController");

const {
  verifyMSG91OTP
}
=
require("../controllers/otpController");


const {
  protect
}
=
require("../middleware/authMiddleware");



// OTP verification

router.post(
"/verify-otp",
verifyMSG91OTP
);



// Register

router.post(
"/register",
register
);



// Password login

router.post(
"/login",
login
);

router.post(
"/otp-login",
loginWithOTP
);

// Current user

router.get(
"/me",
protect,
getMe
);



// Logout

router.post(
"/logout",
logout
);



// Forgot password

router.post(
"/forgot-password",
forgotPassword
);



// Reset password

router.put(
"/reset-password/:token",
resetPassword
);



module.exports = router;
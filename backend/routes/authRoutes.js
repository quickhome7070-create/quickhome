const express = require("express");
const router = express.Router();

const {protect} = require("../middleware/authMiddleware");   // ✅ default import

const {
  register,
  login,
  getMe,
  logout,
} = require("../controllers/authController");

// ROUTES
router.post("/register", register);
router.post("/login", login);
// router.get("/me", protect, getMe);   // protect must be FUNCTION
router.get("/me", protect, (req, res) => {
   res.json({
    user: req.user,
  });
});
router.post("/logout", logout);

module.exports = router;

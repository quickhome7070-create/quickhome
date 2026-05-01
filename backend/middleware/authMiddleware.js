const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;   // contains userId

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// module.exports = protect;
exports.adminOnly = async (req, res, next) => {
  try {

    const user = await User.findById(req.user.userId);

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access only",
      });
    }

    next();

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
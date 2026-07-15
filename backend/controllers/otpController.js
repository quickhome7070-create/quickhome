const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.loginWithMSG91 = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        message: "Phone number is required",
      });
    }

    const normalizedPhone = phone.replace(/\D/g, "");

    // Find existing user
    let user = await User.findOne({
      phone: normalizedPhone,
    });

    // Create user if not found
    if (!user) {
      user = await User.create({
        name: "User",
        phone: normalizedPhone,
        isPhoneVerified: true,
        authMethods: ["otp"],
      });

      console.log("New user created:", user.phone);
    } else {
      user.isPhoneVerified = true;

      if (!user.authMethods.includes("otp")) {
        user.authMethods.push("otp");
      }

      await user.save();

      console.log("Existing user updated:", user.phone);
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const isProd = process.env.NODE_ENV === "production";

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      ...(isProd && {
        domain: ".ghardestiny.com",
      }),
    });

    return res.json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error("MSG91 Login Error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};
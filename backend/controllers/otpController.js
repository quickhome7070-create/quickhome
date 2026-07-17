const User = require("../models/User");
const OTPVerification = require("../models/OTPVerification");
const jwt = require("jsonwebtoken");



exports.verifyMSG91OTP = async (req, res) => {
  try {
    const { phone, msg91Response } = req.body;

    if (!phone) {
      return res.status(400).json({
        message: "Phone number is required",
      });
    }

    const normalizedPhone = phone.replace(/\D/g, "");

    // TODO:
    // Verify msg91Response with MSG91 backend API here.
    // Do not trust the frontend response alone.

    await OTPVerification.findOneAndUpdate(
      {
        phone: normalizedPhone,
      },
      {
        phone: normalizedPhone,
        verified: true,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
      {
        upsert: true,
        new: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("OTP VERIFY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "OTP verification failed",
    });
  }
};
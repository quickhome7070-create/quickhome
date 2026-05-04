const User = require("../models/User");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const Otp = require("../models/Otp");


const MAX_ATTEMPTS = 5;
const BLOCK_WINDOW_MINUTES = 10;
const MAX_BLOCKED_OTPS = 3;

exports.verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const normalizedPhone = phone.replace(/\D/g, "");

    // 🔥 Get latest OTP
    const otpDoc = await Otp.findOne({ phone: normalizedPhone })
      .sort({ createdAt: -1 });

    if (!otpDoc) {
      return res.status(400).json({ message: "OTP not found" });
    }

    // 🔥 GLOBAL BRUTE-FORCE PROTECTION
    const attemptsCount = await Otp.countDocuments({
      phone: normalizedPhone,
      attempts: { $gte: MAX_ATTEMPTS },
      createdAt: {
        $gt: new Date(Date.now() - BLOCK_WINDOW_MINUTES * 60 * 1000),
      },
    });

    if (attemptsCount > MAX_BLOCKED_OTPS) {
      return res.status(429).json({
        message: "Too many failed attempts. Try again later",
      });
    }

    // ❌ Per OTP attempt limit
    if (otpDoc.attempts >= MAX_ATTEMPTS) {
      return res.status(429).json({
        message: "Too many attempts. Please request a new OTP",
      });
    }

    // ❌ Expired OTP
    if (otpDoc.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // ❌ Wrong OTP
    if (otpDoc.otp !== String(otp)) {
      otpDoc.attempts += 1;
      await otpDoc.save();

      return res.status(400).json({
        message: `Invalid OTP (${otpDoc.attempts}/${MAX_ATTEMPTS})`,
      });
    }

    // ✅ SUCCESS → delete OTP
    await Otp.deleteOne({ _id: otpDoc._id });

    // ✅ Find or create user
    let user = await User.findOne({ phone: normalizedPhone });

    if (!user) {
      user = await User.create({
        phone: normalizedPhone,
        name: phone,
        isPhoneVerified: true,
      });
    } else {
      user.isPhoneVerified = true;
      await user.save();
    }

    // ✅ Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Cookie config (safe for dev + prod)
    const isProd = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      ...(isProd && { domain: ".ghardestiny.com" }),
    });

    res.json({
      message: "Login successful",
      user,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    const normalizedPhone = phone.replace(/\D/g, "");

    // 🔥 ADD IT HERE (before generating OTP)
    const existing = await Otp.findOne({ phone: normalizedPhone })
      .sort({ createdAt: -1 });

    if (
      existing &&
      existing.expiresAt > new Date(Date.now() - 60 * 1000)
    ) {
      return res.status(400).json({
        message: "Please wait before requesting another OTP",
      });
    }

    // ✅ NOW generate OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // Save OTP
    await Otp.create({
      phone: normalizedPhone,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    console.log("OTP:", otp);

    // send SMS...
    await axios.post("https://control.msg91.com/api/sendhttp.php", null, {
      params: {
        authkey: process.env.MSG91_AUTH_KEY,
        mobiles: `91${normalizedPhone}`,
        message: `Your OTP is ${otp}`,
        sender: "TXTLCL",
        route: 4,
      },
    });

    res.json({ message: "OTP sent successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
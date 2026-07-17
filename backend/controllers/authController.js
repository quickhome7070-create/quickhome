
const crypto = require("crypto");


const User =
require("../models/User");


const bcrypt =
require("bcryptjs");


const jwt =
require("jsonwebtoken");


const OTPVerification =
require("../models/OTPVerification");

const isProd = process.env.NODE_ENV === "production";



exports.register =
  async (req, res) => {


    try {


      const {
        name,
        email,
        phone,
        password
      } = req.body;




      if (
        !name ||
        !email ||
        !phone ||
        !password
      ) {

        return res.status(400).json({

          message:
            "All fields required"

        });

      }





      const normalizedPhone =
        phone.replace(/\D/g, "");





      // Check OTP

      const otpVerified =
        await OTPVerification.findOne({

          phone: normalizedPhone,

          verified: true

        });





      if (!otpVerified) {


        return res.status(403).json({

          message:
            "Verify phone first"

        });


      }





      // Check existing user


      const exists =
        await User.findOne({

          $or: [

            {
              email
            },

            {
              phone: normalizedPhone
            }

          ]

        });



      if (exists) {

        return res.status(400).json({

          message:
            "User already exists"

        });

      }





      const hash =
        await bcrypt.hash(
          password,
          12
        );





      const user =
        await User.create({

          name,

          email,

          phone: normalizedPhone,

          password: hash,


          isPhoneVerified: true,


          authMethods: [
            "otp",
            "password"
          ]

        });





      // delete OTP session

      await OTPVerification.deleteOne({

        _id:
          otpVerified._id

      });





      // JWT


      const token =
        jwt.sign(

          {

            userId: user._id,

            role: user.role

          },

          process.env.JWT_SECRET,

          {

            expiresIn: "7d"

          }

        );










      res.cookie(
        "token",
        token,
        {

          httpOnly: true,

          secure: isProd,

          sameSite:
            isProd
              ?
              "none"
              :
              "lax",

          maxAge:
            7 * 24 * 60 * 60 * 1000

        }

      );





      return res.status(201).json({

        message:
          "Registration successful",


        user: {

          id: user._id,

          name: user.name,

          phone: user.phone,

          email: user.email,

          role: user.role

        }

      });


    }
    catch (error) {


      console.log(error);


      return res.status(500).json({

        message: error.message

      });


    }


  };



// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
   {
    userId: user._id,
    role: user.role,
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

// res.cookie("token", token, {
//   httpOnly: true,
//   maxAge: 7 * 24 * 60 * 60 * 1000,
//   secure: process.env.NODE_ENV === "production",  
//   sameSite: "none",  
//   domain: ".ghardestiny.com",
// });

res.cookie("token", token, {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  ...(isProd && { domain: ".ghardestiny.com" }),
});

res.json({
  user:{
    id:user._id,
    name:user.name,
    email:user.email,
    phone:user.phone,
    role:user.role
  }
});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// GET CURRENT USER (BACKEND)
exports.getMe = async (req, res) => {
  
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// LOGOUT
exports.logout = async (req, res) => {
  try {
res.clearCookie("token", {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  ...(isProd && { domain: ".ghardestiny.com" }),
});

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//Forgot Controller

exports.forgotPassword = async (req, res) => {
  const sendEmail = require("../utils/sendEmail");
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save hashed token
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min

    await user.save();

    // FRONTEND URL
    // const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
   const resetUrl =
 `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
 

    await sendEmail({
  to: user.email,
  subject: "Password Reset",
  html: `
    <h2>Password Reset</h2>

    <p>Click below link:</p>

    <a href="${resetUrl}">
      Reset Password
    </a>
  `,
});

    // Later send email here

    res.json({
      message: "Reset link generated",
      resetUrl,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const resetToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    user.password = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({
      message: "Password reset successful",
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
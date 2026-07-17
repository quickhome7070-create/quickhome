const User = require("../models/User");
const jwt = require("jsonwebtoken");


exports.loginWithOTP = async (req, res) => {
  try {

    const { phone } = req.body;


    if (!phone) {
      return res.status(400).json({
        message: "Phone number required",
      });
    }


    const normalizedPhone =
      phone.replace(/\D/g, "");



    const user = await User.findOne({
      phone: normalizedPhone,
    });



    if (!user) {
      return res.status(404).json({
        message:
          "Account not found. Please register first.",
      });
    }



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



    const isProd =
      process.env.NODE_ENV === "production";


    res.cookie(
      "token",
      token,
      {
        httpOnly:true,
        secure:isProd,
        sameSite:isProd ? "none" : "lax",
        maxAge:
          7 * 24 * 60 * 60 * 1000,
      }
    );



    return res.json({
      message:"Login successful",
      user:{
        id:user._id,
        name:user.name,
        email:user.email,
        phone:user.phone,
        role:user.role,
      },
    });


  } catch(error){

    console.log(
      "OTP LOGIN ERROR:",
      error
    );

    res.status(500).json({
      message:error.message,
    });

  }
};
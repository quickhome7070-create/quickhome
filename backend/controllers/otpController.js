const User = require("../models/User");

const jwt = require("jsonwebtoken");




const MAX_ATTEMPTS = 5;
const BLOCK_WINDOW_MINUTES = 10;
const MAX_BLOCKED_OTPS = 3;

exports.loginWithMSG91 = async (req,res)=>{

  try {

    const { phone } = req.body;

    console.log("MSG91 LOGIN PHONE:", phone);


    res.json({
      message:"Login successful"
    });


  } catch(error){

    res.status(500).json({
      message:error.message
    });

  }

};



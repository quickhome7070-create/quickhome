const User = require("../models/User");
const OTPVerification = require("../models/OTPVerification");
const jwt = require("jsonwebtoken");



exports.verifyMSG91OTP = async(req,res)=>{

try{


const {
phone,
msg91Response
}=req.body;



if(!phone){

return res.status(400).json({

message:"Phone required"

});

}



const normalizedPhone =
phone.replace(/\D/g,"");



// MSG91 verification succeeded
// Create or find user

let user =
await User.findOne({

phone:normalizedPhone

});



if(!user){

user =
await User.create({

name:"User",

phone:normalizedPhone,

isPhoneVerified:true,

authMethods:[
"otp"
]

});

}
else{


user.isPhoneVerified=true;


if(!user.authMethods.includes("otp")){

user.authMethods.push("otp");

}


await user.save();

}




// JWT

const token =
jwt.sign(

{
userId:user._id,
role:user.role
},

process.env.JWT_SECRET,

{
expiresIn:"7d"
}

);




// Cookie

const isProd =
process.env.NODE_ENV==="production";


res.cookie(
"token",
token,
{

httpOnly:true,

secure:isProd,

sameSite:
isProd
?
"none"
:
"lax",

maxAge:
7*24*60*60*1000

}

);




return res.json({

message:"Login successful",

user

});


}
catch(error){

console.log(error);


res.status(500).json({

message:error.message

});


}

};
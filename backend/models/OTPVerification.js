const mongoose = require("mongoose");


const otpVerificationSchema =
new mongoose.Schema(
{

phone:{
    type:String,
    required:true
},


verified:{
    type:Boolean,
    default:false
},


expiresAt:{
    type:Date,
    expires:300,
    default:Date.now
}

},
{
timestamps:true
}

);



module.exports =
mongoose.model(
"OTPVerification",
otpVerificationSchema
);
const mongoose = require("mongoose");


const otpVerificationSchema =
new mongoose.Schema(
{

phone:{
    type:String,
    required:true,
    index:true
},


verified:{
    type:Boolean,
    default:false
},


expiresAt:{
    type:Date,
    default: () => Date.now() + 5 * 60 * 1000,
    expires: 0
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
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const axios = require("axios");


exports.msg91Verify = async(req,res)=>{

try{

const {
phone
}=req.body;


let user = await User.findOne({
phone
});


if(!user){

user = await User.create({

phone,

name:phone,
    
isPhoneVerified:true

});

}
else{

user.isPhoneVerified=true;

await user.save();

}



const token = jwt.sign(
{
userId:user._id,
role:user.role
},
process.env.JWT_SECRET,
{
expiresIn:"7d"
}
);



const isProd =
process.env.NODE_ENV==="production";


res.cookie(
"token",
token,
{

httpOnly:true,

secure:isProd,

sameSite:isProd?"none":"lax",

maxAge:
7*24*60*60*1000,

...(isProd && {
domain:".ghardestiny.com"
})

});


res.json({

message:"Login successful",

user

});


}
catch(error){

res.status(500)
.json({
message:error.message
});


}


}
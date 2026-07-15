const Property = require("../models/Property");
const User = require("../models/User");


exports.viewContact = async(req,res)=>{

try{


const user =
await User.findById(
req.user.userId
);



if(!user){

return res.status(404).json({
message:"User not found"
});

}



const property =
await Property.findById(
req.params.id
)
.populate(
"owner",
"name phone email"
);



if(!property){

return res.status(404).json({
message:"Property not found"
});

}




// ======================
// PREMIUM EXPIRY
// ======================

if(

user.subscription.status==="premium" &&

user.subscription.expiresAt &&

user.subscription.expiresAt < new Date()

){


user.subscription.status="free";

user.subscription.premiumContactsRemaining=0;

user.subscription.freeContactsRemaining=3;

user.subscription.expiresAt=null;


await user.save();

}





// ======================
// PREMIUM USER
// ======================

if(
user.subscription.status==="premium"
){



if(
user.subscription.premiumContactsRemaining <=0
){

return res.status(403).json({

message:
"Your premium contacts are finished. Please renew your plan."

});

}



// deduct premium contact

user.subscription.premiumContactsRemaining -=1;


await user.save();



return res.json({

name:property.owner.name,

phone:property.owner.phone,

email:property.owner.email,


contactsRemaining:
user.subscription.premiumContactsRemaining,


premium:true

});


}







// ======================
// FREE USER
// ======================



const alreadyViewed =
user.subscription.viewedProperties.some(

(id)=>
id.toString() ===
property._id.toString()

);



if(!alreadyViewed){


if(
user.subscription.freeContactsRemaining<=0
){

return res.status(403).json({

message:
"Free contacts finished. Please upgrade."

});

}



user.subscription.freeContactsRemaining -=1;


user.subscription.viewedProperties.push(
property._id
);


await user.save();

}




return res.json({

name:property.owner.name,

phone:property.owner.phone,

email:property.owner.email,


contactsRemaining:
user.subscription.freeContactsRemaining,


premium:false

});




}
catch(error){


console.log(error);


res.status(500).json({

message:error.message

});


}


};
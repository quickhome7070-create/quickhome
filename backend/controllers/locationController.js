const Location =
require("../models/Location");


exports.searchLocation =
async(req,res)=>{

try{

const keyword =
req.query.keyword || "";


if(!keyword.trim()){

return res.json({
success:true,
locations:[]
});

}



const locations = await Location.find({
  $or: [
    {
      city: {
        $regex: keyword,
        $options: "i",
      },
    },
    {
      locality: {
        $regex: keyword,
        $options: "i",
      },
    },
  ],
})
.sort({ type: 1, city: 1, locality: 1 })
.limit(10);

res.json({

success:true,

locations

});


}
catch(error){

console.log(error);


res.status(500).json({

success:false,

message:error.message

});

}

};
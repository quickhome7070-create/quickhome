const mongoose = require("mongoose");


const PropertyEditRequestSchema = new mongoose.Schema(
{

property:{
 type:mongoose.Schema.Types.ObjectId,
 ref:"Property",
 required:true
},


requestedBy:{
 type:mongoose.Schema.Types.ObjectId,
 ref:"User",
 required:true
},


oldData:{
 type:Object,
 required:true
},


changes:{
 type:Object,
 required:true
},


addedImages:[
 String
],


removedImages:[
 String
],


status:{
 type:String,
 enum:[
  "pending",
  "approved",
  "rejected"
 ],
 default:"pending"
}


},
{
timestamps:true
});


module.exports =
mongoose.model(
"PropertyEditRequest",
PropertyEditRequestSchema
);
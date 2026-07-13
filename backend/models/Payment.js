const mongoose = require("mongoose");


const paymentSchema = new mongoose.Schema(

{

  orderId: {
    type:String,
    required:true,
    unique:true,
  },


  userId: {
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },


  amount:{
    type:Number,
    default:99,
  },


  status:{
    type:String,
    enum:[
      "PENDING",
      "PAID",
      "FAILED"
    ],
    default:"PENDING",
  },


  paymentGateway:{
    type:String,
    default:"CASHFREE",
  },


  paymentId:{
    type:String,
  },


},

{
 timestamps:true
}

);


module.exports =
mongoose.model(
 "Payment",
 paymentSchema
);
const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
{
  type: {
    type: String,
    enum: ["city", "locality"],
    required: true,
  },

  country:{
    type:String,
    default:"India",
    index:true
  },

  state:{
    type:String,
    required:true,
    index:true
  },

  city:{
    type:String,
    required:true,
    index:true
  },

  locality:{
    type:String,
    default:"",
    index:true
  },

},
{
  timestamps:true
}
);


// autocomplete search
locationSchema.index({
  city:"text",
  locality:"text"
});


module.exports = mongoose.model(
"Location",
locationSchema
);
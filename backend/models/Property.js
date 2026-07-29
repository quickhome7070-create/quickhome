const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    propertyType: {
      type: String,
      enum: [
        "Flat",
        "House",
        "Plot",
        "Office Space",
        "Shop",
      ],
      required: true,
    },

    // NEW
    bhkType: {
      type: String,
      default: "",
    },

    // NEW
    plotType: {
      type: String,
      enum: ["Residential", "Commercial", ""],
      default: "",
    },

    // NEW
  furnishing: {
 type:String,
 enum:[
   "Furnished",
   "Semi Furnished",
   "Fully Furnished",
   "Unfurnished",
   ""
 ],
 default:""
},

    // NEW
    shopType: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

   city:{
  type:String,
  required:true,
  index:true
},

locality:{
  type:String,
  required:true,
  index:true
},

 // AREA
area: {
  type: Number,
  default: 0,
},

areaUnit: {
  type: String,
  enum: ["sqft", "sqm"],
  default: "sqft",
},


// BATHROOM
bathrooms: {
  type: String,
  default: "",
},

views:{
 type:Number,
 default:0
},

// PROPERTY AGE
propertyAge: {
  type: String,
  default: "",
},


// FLOOR DETAILS
floor: {
  type: Number,
  default: 0,
},

totalFloors: {
  type: Number,
  default: 0,
},


// AMENITIES
amenities: [
  {
    type: String,
  },
],


// AVAILABILITY
availableFrom: {
  type: Date,
},  

    description: {
      type: String,
      default: "",
    },

    listingType: {
      type: String,
      enum: ["buy", "rent"],
      default: "buy",
    },

    seller: {
      type: String,
      enum: ["owner", "agent"],
      default: "",
    },

    status: {
      type: String,
      enum: ["active", "sold", "inactive"],
      default: "active",
    },

    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    images: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Property",
  propertySchema
);
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
        "Villa",
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

    // Area Details
area: {
  type: Number,
  default: 0,
},

areaUnit: {
  type: String,
  enum: [
    "sqft",
    "sqm",
    "acre"
  ],
  default: "sqft",
},

// Property Details
bathrooms: {
  type: Number,
  default: 0,
},

propertyAge: {
  type: String,
  default: "",
},



totalFloors: {
  type: Number,
  default: 0,
},


// Amenities
amenities: [
  {
    type: String,
  }
],


// Availability
availableFrom: {
  type: Date,
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



areaUnit: {
  type: String,
  enum: ["sqft", "sqm"],
  default: "sqft",
},


// BATHROOM


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
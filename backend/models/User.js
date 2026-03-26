const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
  type: String,
},
  password: {
    type: String,
    required: true
  },
  favorites: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
  },
  
],

recentlyViewed: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
  },
],

// subscription: {
//   subscriptionId: String,
//   planId: String,
//   status: String,
//   isActive: Boolean,
//   expiresAt: Date,
// },

subscription: {
  status: { type: String, default: "inactive" },
  isActive: { type: Boolean, default: false },
  trialEndsAt: { type: Date },
  freeContactsRemaining: { type: Number, default: 0 },
  viewedProperties: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
  ],
},
contactViews: {
  type: Number,
  default: 0,
},

isSubscribed: {
  type: Boolean,
  default: true,
},


viewedContacts: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
  }
],


}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

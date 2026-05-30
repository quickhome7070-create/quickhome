const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

subscription: {
  status: {
    type: String,
    enum: ["free", "premium"],
    default: "free",
  },

  freeContactsRemaining: {
    type: Number,
    default: 3,
  },

  viewedProperties: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
  ],

  expiresAt: Date,
},

  phone: {
    type: String,
    unique: true,
  },

  email: {
    type: String,
  },

  isPhoneVerified: {
    type: Boolean,
    default: false,
  },

  isEmailVerified: {
    type: Boolean,
    default: false,
  },

  resetPasswordToken: {type:String},

  resetPasswordExpire:{type:Date} ,

  authMethods: {
    type: [String],
    enum: ["otp", "password", "google"],
    default: ["otp"],
  },

  password: {
    type: String, // only if using password login
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  favorites: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
  ],

  recentlyViewed: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
  ],

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
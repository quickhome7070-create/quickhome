const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  subscription: {
  status: {
    type: String,
    enum: ["trial", "active", "expired", "inactive"],
    default: "inactive",
  },
  isActive: { type: Boolean, default: false },
  trialEndsAt: Date,
  freeContactsRemaining: { type: Number, default: 0 },
  viewedProperties: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Property" }
  ],
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
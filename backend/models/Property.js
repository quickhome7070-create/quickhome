const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: "",
  },

  status: {
    type: String,
    enum: ["active", "sold", "inactive"],
    default: "active",
  },

    // ✅ Approval status (ADMIN CONTROL)
  approvalStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  contactViews: { type: Number, default: 0 },


  images: [{
    type: String,
  }],

}, { timestamps: true });

propertySchema.index({
  title: "text",
  description: "text",
  location: "text",
});



module.exports = mongoose.model("Property", propertySchema);

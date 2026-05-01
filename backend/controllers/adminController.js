const Property = require("../models/Property");


// GET PENDING
exports.getPendingProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      approvalStatus: "pending",
    }).populate("owner", "name email");

    res.json(properties);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// APPROVE
exports.approveProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    property.approvalStatus = "approved";

    await property.save();

    res.json({
      message: "Property approved",
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// REJECT
exports.rejectProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    property.approvalStatus = "rejected";

    await property.save();

    res.json({
      message: "Property rejected",
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const Property = require("../models/Property");
const User = require("../models/User");

exports.viewContact = async (req, res) => {
  try {
      
    const user = await User.findById(req.user.userId);
console.log("USER ID:", user._id);


    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const property = await Property.findById(req.params.id).populate("owner");

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (!property.owner) {
      return res.status(400).json({
        message: "Property owner not available",
      });
    }

    // 🔥 AUTO TRIAL
    if (!user.subscription?.status || user.subscription.status === "inactive") {
     user.subscription = user.subscription || {};

user.subscription.status = "trial";
user.subscription.isActive = true;
user.subscription.trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
user.subscription.freeContactsRemaining = 3;
user.subscription.viewedProperties = [];
      await user.save();
    }

    // 🔥 EXPIRED
    if (
      user.subscription.status === "trial" &&
      user.subscription.trialEndsAt < new Date()
    ) {
      user.subscription.isActive = false;
      user.subscription.status = "expired";
      await user.save();

      return res.status(403).json({
        message: "Trial expired. Please renew plan.",
      });
    }

    const alreadyViewed = user.subscription.viewedProperties.some(
      (id) => id.toString() === property._id.toString()
    );

    if (!alreadyViewed) {
      if (user.subscription.freeContactsRemaining <= 0) {
        return res.status(403).json({
          message: "Free contacts finished. Please renew plan.",
        });
      }

      user.subscription.freeContactsRemaining -= 1;
      user.subscription.viewedProperties.push(property._id);
      await user.save();

      console.log("Remaining:", user.subscription?.freeContactsRemaining);
console.log("Viewed Properties:", user.subscription?.viewedProperties);
console.log("Current Property:", property._id);
    }

    res.json({
  name: property.owner?.name || "N/A",
  phone: property.owner?.phone || "N/A",
  email: property.owner?.email || "N/A",
  contactsRemaining: user.subscription.freeContactsRemaining,
  alreadyViewed,
});

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }

};
const Property = require("../models/Property");
const User = require("../models/User");

exports.viewContact = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const propertyId = req.params.id;

    // 🔥 1️⃣ AUTO START TRIAL
    if (!user.subscription || user.subscription.status === "inactive") {
      user.subscription = {
        status: "trial",
        isActive: true,
        trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        freeContactsRemaining: 3,
        viewedProperties: [],
      };
      await user.save();
    }

    // 🔥 2️⃣ CHECK TRIAL EXPIRY
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

    // 🔥 3️⃣ GET PROPERTY
    const property = await Property.findById(propertyId).populate("owner");

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // 🔥 4️⃣ CHECK IF ALREADY VIEWED
    const alreadyViewed = user.subscription.viewedProperties.some(
      (id) => id.toString() === property._id.toString()
    );

    // 🔥 5️⃣ DEDUCT ONLY FIRST TIME
    if (!alreadyViewed) {
      if (user.subscription.freeContactsRemaining <= 0) {
        return res.status(403).json({
          message: "Free contacts finished. Please renew plan.",
        });
      }

      user.subscription.freeContactsRemaining -= 1;
      user.subscription.viewedProperties.push(property._id);

      await user.save();
    }

    // 🔥 6️⃣ RETURN REAL CONTACT
    res.json({
      name: property.owner.name,
      phone: property.owner.phone,
      email: property.owner.email,
      contactsRemaining: user.subscription.freeContactsRemaining,
      alreadyViewed,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
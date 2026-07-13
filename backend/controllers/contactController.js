const Property = require("../models/Property");
const User = require("../models/User");

exports.viewContact = async (req, res) => {
  try {

    console.log("req.user =", req.user);
    console.log("propertyId =", req.params.id);


    const user = await User.findById(
      req.user.userId
    );


    const property = await Property.findById(
      req.params.id
    ).populate("owner");


    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }


    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }


    if (!property.owner) {
      return res.status(404).json({
        message: "Property owner not found",
      });
    }



    // =========================
    // CHECK PREMIUM EXPIRY
    // =========================

    if (
      user.subscription.status === "premium" &&
      user.subscription.expiresAt &&
      user.subscription.expiresAt < new Date()
    ) {
      return res.json({

name:property.owner.name,

phone:property.owner.phone,

email:property.owner.email,

contactsRemaining:
user.subscription.freeContactsRemaining

});

      // user.subscription.status = "free";
      // user.subscription.freeContactsRemaining = 3;
      // user.subscription.expiresAt = null;

      await user.save();

      console.log(
        "Premium expired. Downgraded:",
        user._id
      );
    }



    // =========================
    // PREMIUM USER
    // =========================

    if (
      user.subscription.status === "premium"
    ) {

      return res.json({

        name: property.owner.name,

        phone: property.owner.phone,

        email: property.owner.email,

        contactsRemaining:
          user.subscription.freeContactsRemaining,

        premium: true,

      });
    }



    // =========================
    // FREE USER
    // =========================


    const alreadyViewed =
      user.subscription.viewedProperties.some(
        (id) =>
          id.toString() ===
          property._id.toString()
      );



    if (!alreadyViewed) {


      if (
        user.subscription.freeContactsRemaining <= 0
      ) {

        return res.status(403).json({

          message:
            "Your free contacts are finished. Please upgrade.",

        });
      }



      user.subscription.freeContactsRemaining -= 1;


      user.subscription.viewedProperties.push(
        property._id
      );


      await user.save();

    }



    return res.json({

      name: property.owner.name,

      phone: property.owner.phone,

      email: property.owner.email,

      contactsRemaining:
        user.subscription.freeContactsRemaining,

      premium: false,

    });



  } catch (error) {

    console.error(
      "View Contact Error:",
      error
    );


    return res.status(500).json({

      message: "Server error",

    });

  }
};
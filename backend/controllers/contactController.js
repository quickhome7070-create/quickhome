const Property = require("../models/Property");
const User = require("../models/User");



exports.viewContact = async (req, res) => {

  try {


    const user = await User.findById(
      req.user.userId
    );


    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }



    // Safety check for old users
    if (!user.subscription) {

      user.subscription = {
        status: "free",
        freeContactsRemaining: 3,        
        viewedProperties: [],
        expiresAt: null
      };

      await user.save();

    }



    const property = await Property.findById(
      req.params.id
    )
    .populate(
      "owner",
      "name phone email"
    );



    if (!property) {

      return res.status(404).json({
        message: "Property not found"
      });

    }



    if (!property.owner) {

      return res.status(404).json({
        message: "Owner details not found"
      });

    }



    // =================================
    // CHECK PREMIUM EXPIRY
    // =================================


    if (

      user.subscription.status === "premium" &&

      user.subscription.expiresAt &&

      user.subscription.expiresAt < new Date()

    ) {


      user.subscription.status = "free";

     

      user.subscription.freeContactsRemaining = 3;

      user.subscription.expiresAt = null;


      await user.save();

    }




    // =================================
    // PREMIUM USER
    // =================================


if (user.subscription.status === "premium") {


  // check already viewed
  const alreadyViewed =
    user.subscription.viewedProperties.some(
      (id) =>
        id.toString() === property._id.toString()
    );


  // deduct only first time
  if (!alreadyViewed) {


    if (
      user.subscription.freeContactsRemaining <= 0
    ) {

      return res.status(403).json({
        message:
        "Premium contacts finished. Please renew your plan."
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


    premium:true

  });

}



    // =================================
    // FREE USER
    // =================================



    if (
      !user.subscription.viewedProperties
    ) {

      user.subscription.viewedProperties = [];

    }



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
          "Free contacts finished. Please upgrade."

        });

      }



      // deduct free contact

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


      premium:false

    });



  }
  catch(error) {


    console.log(
      "View Contact Error:",
      error
    );


    return res.status(500).json({

      message:
      "Server error"

    });


  }

};
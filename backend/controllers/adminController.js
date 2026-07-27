const Property = require("../models/Property");
const PropertyEditRequest =
require("../models/PropertyEditRequest");

// GET PENDING
// Pending
exports.getPendingProperties = async (req, res) => {
  const properties = await Property.find({
    approvalStatus: "pending",
  })
    .populate("owner", "name email")
    .sort({ createdAt: -1 });

  res.json(properties);
};

exports.getPendingEditRequests = async (req, res) => {

  try {

    const requests =
      await PropertyEditRequest.find({
        status: "pending"
      })
      .populate({
        path: "property",
        populate: {
          path: "owner",
          select: "name email"
        }
      });


    res.json(requests);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:"Failed to fetch edit requests"
    });

  }

};

exports.rejectEditRequest = async(req,res)=>{

  try {

    const request =
      await PropertyEditRequest.findById(
        req.params.id
      );


    if(!request){
      return res.status(404).json({
        message:"Edit request not found"
      });
    }


    request.status="rejected";

    await request.save();


    res.json({
      message:"Edit request rejected"
    });


  } catch(error){

    console.log(error);

    res.status(500).json({
      message:error.message
    });

  }

};
exports.approveEditRequest = async (req, res) => {

  try {

    const request =
      await PropertyEditRequest.findById(
        req.params.id
      );


    if (!request) {
      return res.status(404).json({
        message: "Edit request not found"
      });
    }


    const property =
      await Property.findById(
        request.property
      );


    if (!property) {
      return res.status(404).json({
        message: "Property not found"
      });
    }


    console.log(
      "OLD PROPERTY",
      property
    );


    console.log(
      "EDIT CHANGES",
      request.changes
    );


    // apply changes
   Object.assign(
property,
request.changes
);


// remove deleted images

property.images =
property.images.filter(
(img)=>
!request.removedImages.includes(img)
);


// add new images

property.images.push(
...request.addedImages
);


await property.save();


    // add images
    if (
      request.images &&
      request.images.length > 0
    ) {

      property.images.push(
        ...request.images
      );

    }


    await property.save();


    request.status = "approved";

    await request.save();


    console.log(
      "UPDATED PROPERTY",
      property
    );


    res.json({
      message:"Edit approved",
      property
    });


  } catch(error){

    console.log(error);

    res.status(500).json({
      message:error.message
    });

  }

};

exports.getPendingEdits = async (req, res) => {
  try {
    const requests = await PropertyEditRequest.find({
      status: "pending",
    })
      .populate({
        path: "property",
        populate: {
          path: "owner",
          select: "name email",
        },
      })
      .populate("requestedBy", "name email");
      console.log(
  JSON.stringify(requests[0], null, 2)
);

    res.json(requests);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
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





exports.getAdminStats = async (req, res) => {
  try {

    // New property pending approval
    const pendingProperties = await Property.countDocuments({
      approvalStatus: "pending",
    });


    // Edit requests pending approval
    const pendingEdits = await PropertyEditRequest.countDocuments({
      status: "pending",
    });


    // Total pending = new + edit requests
    const pending = pendingProperties + pendingEdits;


    const approved = await Property.countDocuments({
      approvalStatus: "approved",
    });


    const rejected = await Property.countDocuments({
      approvalStatus: "rejected",
    });


    const total = await Property.countDocuments();


    res.json({
      pending,
      approved,
      rejected,
      total,
    });


  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }
};

exports.getApprovedProperties = async (req, res) => {
  const properties = await Property.find({
    approvalStatus: "approved",
  })
    .populate("owner", "name email")
    .sort({ createdAt: -1 });

  res.json(properties);
};

exports.pendingEdits = async(req,res)=>{

const requests =
await PropertyEditRequest
.find({
status:"pending"
})
.populate("property")
.populate("requestedBy");


res.json(requests);

};
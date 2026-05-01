const Property = require("../models/Property");
const User = require("../models/User");
const mongoose = require("mongoose");
// CREATE PROPERTY
exports.createProperty = async (req, res) => {
  try {
    const { title, price, location,description  } = req.body;
    const images = req.files ? req.files.map(file=>file.path ):[];

    const property = await Property.create({
      title,
      price,
      location,
      description,
      images,
      owner: req.user.userId,
    });

    res.status(201).json(property);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// GET ALL PROPERTIES (Pagination + Filters)
// exports.getAllProperties = async (req, res) => {
//   try {
//     const { page = 1, limit = 6, location, minPrice, maxPrice, sort = "latest", search } = req.query;


//     let query = { status: "available" };


//     if (search) {
//   query.$text = { $search: search };
// }    

//     // Location filter
//     if (location) {
//       query.location = { $regex: location, $options: "i" };
//     }

//     // Price filter
//     if (minPrice || maxPrice) {
//       query.price = {};
//       if (minPrice) query.price.$gte = Number(minPrice);
//       if (maxPrice) query.price.$lte = Number(maxPrice);
//     }

//     const skip = (page - 1) * limit;

//     // Sorting logic
//     let sortOption = { createdAt: -1 }; // latest default

//     if (sort === "oldest") sortOption = { createdAt: 1 };
//     if (sort === "priceLow") sortOption = { price: 1 };
//     if (sort === "priceHigh") sortOption = { price: -1 };

//     const properties = await Property.find(query)
//       .populate("owner", "name email")
//       .sort(sortOption)
//       .skip(skip)
//       .limit(Number(limit));

//     const total = await Property.countDocuments(query);

//     res.json({
//       total,
//       page: Number(page),
//       pages: Math.ceil(total / limit),
//       properties,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };



// GET MY PROPERTIES (Logged-in user)
exports.getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      owner: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate("owner", "name email");

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // 👁 Increase view count
    property.views += 1;
    await property.save();

    // After increasing views

if (req.user) {
  const user = await User.findById(req.user.userId);

  // remove if already exists
  user.recentlyViewed = user.recentlyViewed.filter(
    (id) => id.toString() !== property._id.toString()
  );

  // add to beginning
  user.recentlyViewed.unshift(property._id);

  // keep only last 10
  user.recentlyViewed = user.recentlyViewed.slice(0, 10);

  await user.save();
}

    res.json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ❤️ Add / Remove Favorite
exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { propertyId } = req.params;

    const user = await User.findById(userId);

    // 🔴 IMPORTANT — prevent crash
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure favorites exists
    if (!user.favorites) {
      user.favorites = [];
    }

    const index = user.favorites.indexOf(propertyId);

    if (index === -1) {
      user.favorites.push(propertyId);
      await user.save();
      return res.json({ message: "Property added to favorites" });
    } else {
      user.favorites.splice(index, 1);
      await user.save();
      return res.json({ message: "Property removed from favorites" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ❤️ Get My Favorites
exports.getMyFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate("favorites")
      .select("favorites");

    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ⭐ Get Favorite Status + Count
exports.getFavoriteStatus = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { propertyId } = req.params;

    const user = await User.findById(userId).select("favorites");

    const isFavorited = user.favorites.includes(propertyId);

    const count = await User.countDocuments({
      favorites: propertyId,
    });

    res.json({
      isFavorited,
      totalFavorites: count,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// UPDATE PROPERTY
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Only owner can update
    if (property.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (property.status === "sold") {
  return res.status(400).json({ message: "Sold property cannot be edited" });
}

    // Text fields
    property.title = req.body.title || property.title;
    property.price = req.body.price || property.price;
    property.location = req.body.location || property.location;
    property.description = req.body.description || property.description;

    // Images (append new images)
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path);
      property.images = [...property.images, ...newImages];
    }

    if (req.body.status) {
  property.status = req.body.status;
}

    const updated = await property.save();

    res.json(updated);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// DELETE PROPERTY
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Check owner
    if (property.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (property.status === "sold") {
  return res.status(400).json({ message: "Cannot delete sold property" });
}


    await property.deleteOne();

    res.json({ message: "Property deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 🔍 Advanced Search
exports.searchProperties = async (req, res) => {
  try {
    const { keyword, location, minPrice, maxPrice, page = 1, limit = 6 } = req.query;

    let query = {};

    if (keyword) {
      query.title = { $regex: keyword, $options: "i" };
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const skip = (page - 1) * limit;

    const properties = await Property.find(query)
      .populate("owner", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Property.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      properties,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🆕 Recently Added Properties
exports.getRecentProperties = async (req, res) => {
  try {
    const properties = await Property.find({
  approvalStatus: "approved",
  status: "active"
})
      .populate("owner", "name email")
      .sort({ createdAt: -1 })
      .limit(2);

    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔁 Similar Properties
exports.getSimilarProperties = async (req, res) => {
  try {
    const propertyId = req.params.id;

    const currentProperty = await Property.findById(propertyId);
    if (!currentProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    const priceRangeMin = currentProperty.price * 0.7;
    const priceRangeMax = currentProperty.price * 1.3;

    const similar = await Property.find({
      _id: { $ne: propertyId },
      approvalStatus: "approved",
      status: "active",
      location: { $regex: currentProperty.location, $options: "i" },
      price: { $gte: priceRangeMin, $lte: priceRangeMax },
    })
      .limit(2)
      .populate("owner", "name email");

    res.json(similar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// 📊 Dashboard Stats

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const soldCount = await Property.countDocuments({
  owner: req.user.userId,
  status: "sold",
});

    // Total properties in platform
    const totalProperties = await Property.countDocuments();

    // My properties
    const myProperties = await Property.countDocuments({ owner: userId });

    // Favorites
    const favorites = user.favorites?.length || 0;

    // Recently viewed
    const recentlyViewed = user.recentlyViewed?.length || 0;

    // Subscription
    const isSubscribed =
      user.subscription?.isActive &&
      new Date() < user.subscription.expiresAt;

    // Remaining contact views
    const remainingViews = isSubscribed
      ? Math.max(0, 20 - (user.contactViews || 0))
      : 0;

    res.json({
      totalProperties,
      myProperties: myProperties,
  sold: soldCount,
  favorites: favoritesCount,
  views: user.contactViews || 0,
      recentlyViewed,
      isSubscribed,
      remainingViews,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ⭐ Most Favorited Properties (Top 5)
exports.getMostFavoritedProperties = async (req, res) => {
  try {
    const topProperties = await User.aggregate([
      { $unwind: "$favorites" },
      {
        $group: {
          _id: "$favorites",
          totalFavorites: { $sum: 1 },
        },
      },
      { $sort: { totalFavorites: -1 } },
      { $limit: 5 },
    ]);

    // Get full property details
    const propertyIds = topProperties.map((item) => item._id);

    const properties = await Property.find({ _id: { $in: propertyIds } })
      .populate("owner", "name email");

    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔥 Trending Properties (Recent + Popular)
exports.getTrendingProperties = async (req, res) => {
  try {
    // Count favorites per property
    const favoritesAgg = await User.aggregate([
      { $unwind: "$favorites" },
      {
        $group: {
          _id: "$favorites",
          totalFavorites: { $sum: 1 },
        },
      },
    ]);

    const favoriteMap = {};
    favoritesAgg.forEach((item) => {
      favoriteMap[item._id.toString()] = item.totalFavorites;
    });

    // Get recent properties
    const properties = await Property.find({
  approvalStatus: "approved",
  status: "active"
})
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("owner", "name email");

    // Add score = favorites + recency weight
    const scored = properties.map((prop, index) => {
      const favCount = favoriteMap[prop._id.toString()] || 0;

      // Recency score (newer = higher)
      const recencyScore = 20 - index;

      return {
        ...prop.toObject(),
        score: favCount * 2 + recencyScore,
      };
    });

    // Sort by score
    scored.sort((a, b) => b.score - a.score);

    res.json(scored.slice(0, 8)); // Top 8 trending
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL PROPERTIES (Advanced Search + Filters + Sorting)
exports.getAllProperties = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 6,
      location,
      minPrice,
      maxPrice,
      keyword,
      sort,
    } = req.query;

    let query = {
  approvalStatus: "approved",   // ✅ only approved
  status: { $ne: "sold" }       // ✅ hide sold
};

    // 🔎 Keyword search (title + description)
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    // 📍 Location filter
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // 💰 Price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 📊 Sorting
    let sortOption = { createdAt: -1 }; // default newest

    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "priceLow") sortOption = { price: 1 };
    if (sort === "priceHigh") sortOption = { price: -1 };

    const skip = (page - 1) * limit;

    const properties = await Property.find(query)
      .populate("owner", "name email")
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Property.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      properties,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRecentlyViewed = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate({
        path: "recentlyViewed",
        options: { sort: { createdAt: -1 } },
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.recentlyViewed || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addRecentlyViewed = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove if already exists (avoid duplicate)
    user.recentlyViewed = user.recentlyViewed.filter(
      (id) => id.toString() !== propertyId
    );

    // Add to start (latest first)
    user.recentlyViewed.unshift(propertyId);

    // Keep only last 10
    if (user.recentlyViewed.length > 10) {
      user.recentlyViewed = user.recentlyViewed.slice(0, 10);
    }

    await user.save();

    res.json({ message: "Recently viewed updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markAsSold = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    property.status = "sold";
    await property.save();

    res.json({ message: "Property marked as SOLD" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSoldProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      owner: req.user.userId,
      status: "sold",
    });

    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

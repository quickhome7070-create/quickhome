const User = require("../models/User");
const Property = require("../models/Property");


// ❤️ Add / Remove Favorite
exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { propertyId } = req.params;

    const user = await User.findById(userId);

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

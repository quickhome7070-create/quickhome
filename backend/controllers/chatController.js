const Message = require("../models/Message");

// GET CHAT HISTORY
exports.getMessages = async (req, res) => {
  try {
    const { userId, propertyId } = req.params;

    const messages = await Message.find({
      property: propertyId,
      $or: [
        { sender: req.user.userId, receiver: userId },
        { sender: userId, receiver: req.user.userId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name")
      .populate("receiver", "name");

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const express = require("express");
const router = express.Router();

const { toggleFavorite, getMyFavorites } = require("../controllers/userController");
const  { protect }  = require("../middleware/authMiddleware");

router.post("/favorite/:propertyId", protect, toggleFavorite);
router.get("/favorites", protect, getMyFavorites);

module.exports = router;


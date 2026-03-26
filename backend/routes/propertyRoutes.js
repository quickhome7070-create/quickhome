const express = require("express");
const router = express.Router();

const  {protect}  = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const {
  createProperty,
  getAllProperties,
  updateProperty,
  getPropertyById,
  getMyProperties,
  deleteProperty,
  toggleFavorite,
  getMyFavorites,
  searchProperties,
  getRecentProperties,
  getSimilarProperties,
  getDashboardStats,
  getFavoriteStatus,
  getMostFavoritedProperties,
  getTrendingProperties,
  getRecentlyViewed,
  addRecentlyViewed,
  markAsSold,
  getSoldProperties,  
} = require("../controllers/propertyController");
const { viewContact } = require("../controllers/contactController");
// CREATE
router.post("/", protect, upload.array("images", 5), createProperty);

// READ
router.get("/", getAllProperties);
router.get("/search", searchProperties);
router.get("/recent", getRecentProperties);
router.get("/similar/:id", getSimilarProperties);
router.get("/stats", protect, getDashboardStats);
router.get("/my-properties", protect, getMyProperties);
router.get("/favorites", protect, getMyFavorites);
router.post("/favorite/:propertyId", protect, toggleFavorite);
router.get("/favorite-status/:propertyId", protect, getFavoriteStatus);
router.get("/top-favorites", getMostFavoritedProperties);
router.get("/trending", getTrendingProperties);
router.get("/recently-viewed", protect, getRecentlyViewed);
router.get("/contact/:id", protect, viewContact);
router.post("/recent/:propertyId", protect, addRecentlyViewed);
router.put("/:id/sold", protect, markAsSold);
router.get("/my-sold", protect, getSoldProperties);
router.get("/:id", getPropertyById);

// UPDATE
router.put("/:id", protect, upload.array("images", 5), updateProperty);

// DELETE
router.delete("/:id", protect, deleteProperty);

module.exports = router;

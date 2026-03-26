const express = require("express");
const router = express.Router();

 const { viewContact } = require("../controllers/contactController");
const { protect } = require("../middleware/authMiddleware");

 router.get("/contact/:id", protect, viewContact);


module.exports = router;

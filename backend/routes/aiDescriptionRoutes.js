const express=require("express");
const Property = require("../models/Property");
const router=express.Router();

const {
generatePropertyDescription,
aiPropertySearch
}=require("../controllers/aiController");


router.post(
"/property-description",
generatePropertyDescription
);

router.post(
"/ai-search",
aiPropertySearch
);

module.exports=router;
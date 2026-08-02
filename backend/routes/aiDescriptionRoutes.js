const express=require("express");

const router=express.Router();

const {
generatePropertyDescription
}=require("../controllers/aiDescriptionController");


router.post(
"/property-description",
generatePropertyDescription
);


module.exports=router;
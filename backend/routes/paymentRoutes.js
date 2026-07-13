const express =
require("express");


const router =
express.Router();


const {
createOrder,
cashfreeWebhook

}=require("../controllers/paymentController");


const {
protect
}=require("../middleware/authMiddleware");




// Create payment

router.post(
"/create-order",
protect,
createOrder
);



// Cashfree webhook

router.post(

"/cashfree-webhook",

express.raw({
type:"application/json"
}),

cashfreeWebhook

);



module.exports =
router;
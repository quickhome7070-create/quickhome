require("win-ca");

const express = require("express");
const app = express();

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectDB = require("./config/db");

require("dotenv").config();


const {
  cashfreeWebhook
} = require("./controllers/paymentController");


const paymentRoutes =
require("./routes/paymentRoutes");



// Trust Render proxy

app.set(
  "trust proxy",
  1
);



// ===============================
// MIDDLEWARE
// ===============================

app.use(
  cookieParser()
);



app.use(
  cors({

    origin:[

      "https://ghardestiny.com",

      "https://www.ghardestiny.com",

      "http://localhost:3000"

    ],

    credentials:true

  })
);



app.use(
  rateLimit({

    windowMs:
      15 * 60 * 1000,

    max:
      100

  })
);



app.use(
  helmet()
);

app.use(
  "/api/admin",
  require("./routes/adminRoutes")
);



// ===============================
// CASHFREE WEBHOOK
// BEFORE JSON
// ===============================

app.post(

  "/api/payment/cashfree-webhook",

  express.raw({
    type:"application/json"
  }),

  cashfreeWebhook

);





// ===============================
// BODY PARSER
// ===============================


app.use(
  express.json()
);


app.use(
  express.urlencoded({
    extended:true
  })
);





// ===============================
// DATABASE
// ===============================

connectDB();





// ===============================
// ROUTES
// ===============================


app.use(
  "/api/auth",
  require("./routes/authRoutes")
);



app.use(
  "/api/payment",
  paymentRoutes
);



app.use(
  "/api/property",
  require("./routes/propertyRoutes")
);



app.use(
  "/api/user",
  require("./routes/userRoutes")
);






// ===============================
// HEALTH CHECK
// ===============================

app.get(
  "/",
  (req,res)=>{

    res.send(
      "Backend running 🚀"
    );

  }
);





// ===============================
// SERVER
// ===============================

const PORT =
process.env.PORT || 5000;


app.listen(
  PORT,
  ()=>{

    console.log(
      `Server running on ${PORT}`
    );

  }
);
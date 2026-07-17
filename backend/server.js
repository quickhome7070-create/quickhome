require("dotenv").config();

require("win-ca");


const express =
require("express");


const cors =
require("cors");


const helmet =
require("helmet");


const cookieParser =
require("cookie-parser");


const connectDB =
require("./config/db");


const authLimiter =
require("./middleware/authLimiter");



const app =
express();





app.set(
"trust proxy",
1
);





connectDB();





app.use(
cookieParser()
);



app.use(
cors({

origin:[
"http://localhost:3000",
"https://ghardestiny.com",
"https://www.ghardestiny.com"
],

credentials:true

})
);



app.use(
helmet()
);



app.use(
express.json()
);



app.use(
express.urlencoded({
extended:true
})
);




// Auth rate limit

app.use(
"/api/auth",
authLimiter
);





// Routes


app.use(
"/api/auth",
require("./routes/authRoutes")
);



app.use(
"/api/property",
require("./routes/propertyRoutes")
);



app.use(
"/api/user",
require("./routes/userRoutes")
);





app.get(
"/",
(req,res)=>{

res.send(
"Backend running 🚀"
);

}
);






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
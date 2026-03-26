const express = require("express");
const app = express();
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(helmet());
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./config/db");
const razorpayRoutes = require("./routes/razorpayRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const userRoutes = require("./routes/userRoutes");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["https://quickhome-26pu9j0sh-quickhome7070-9951s-projects.vercel.app","http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST"],
  },
});


app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Connect DB
connectDB();




app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use("/api/razorpay/webhook", express.raw({ type: "application/json" }));
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/property", propertyRoutes);
app.use("/api/user", userRoutes);
app.use("/api/razorpay", razorpayRoutes);
app.use("/api/subscription", subscriptionRoutes);
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));





// 🔥 ADD THIS LINE
require("./sockets/chatSocket")(io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

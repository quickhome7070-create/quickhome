const User = require("../models/User");

const jwt = require("jsonwebtoken");




const MAX_ATTEMPTS = 5;
const BLOCK_WINDOW_MINUTES = 10;
const MAX_BLOCKED_OTPS = 3;





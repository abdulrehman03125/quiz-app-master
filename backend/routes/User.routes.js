const express = require("express");
const { registerUser, loginUser, verifyToken } = require("../controllers/User.controller");

const router = express.Router();

// Register user
router.post("/register", registerUser);

// Login User
router.post("/login",loginUser);

// Verify Token 
router.post("/verify", verifyToken)


module.exports = router;
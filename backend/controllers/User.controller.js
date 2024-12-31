const UserModel = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Register user
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role, quizzesTaken, confirm } = req.body;

    // Check if the password and confirm password fields match
    if (password !== confirm) {
      return res.status(400).json({
        error: true,
        message: "Passwords do not match",
      });
    }

    // Check if the email or username already exists
    const emailcheck = await UserModel.findOne({ email: email });
    const usernameCheck = await UserModel.findOne({ username: username });

    if (emailcheck || usernameCheck) {
      return res.status(401).json({
        error: true,
        message: "User is already registered",
      });
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const user = await UserModel.create({
      username: username,
      email: email,
      password: hashPassword,
      role: role,
      quizzesTaken: quizzesTaken,
    });

    res.status(200).json({
      error: false,
      message: "User registered successfully",
      user: user,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// Login user 
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email: email });

    if (user == null) {
      return res.status(401).json({
        error: true,
        message: "username or password is incorrect",
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (checkPassword == false) {
      return res.status(401).json({
        error: true,
        message: "username or password is incorect",
      });
    }

    const accessToken = await jwt.sign(
      { userid: user._id , role:user.role},
      process.env.SECURITY_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      error: false,
      message: "successfully login",
      user: user,
      accessToken: accessToken,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      message: "internal server error",
    });
  }
};

// verifyToken and user
const verifyToken = async(req,res)=>{
try {
  const token = req.body.token;
  await jwt.verify(token,process.env.SECURITY_KEY);
  res.status(200).json({
    error:false,

  })

} catch (error) {
  res.status(500).json({
    error:true
  })
}
}

module.exports = {
  registerUser,
  loginUser,
  verifyToken
};

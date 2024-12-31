const express = require("express")
const router = express.Router();
 const {createQuestion} = require("../controllers/Question.controller")


 router.post("/creat", createQuestion)


 module.exports = router


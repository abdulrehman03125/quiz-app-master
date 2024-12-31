const express = require("express");
const { getonequizRuizresults, allResults, quizAllResults } = require("../controllers/Result.controller");
const AuthCheck = require("../middlewares/Auth.middleware");
const router = express.Router();

// Get user result by id only crunt result
router.get("/byid/:id",AuthCheck,getonequizRuizresults)

// Get user all results 
router.get("/all",AuthCheck,allResults)

router.get("/quiz/:id", quizAllResults)

module.exports=router 
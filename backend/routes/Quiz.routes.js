const express = require('express');
const router = express.Router();
const {creatQuiz, getQuizbyID, submitQuiz, getUserAllQuiz, editQuiz, deleteQuiz} = require("../controllers/Quiz.controller")
const AuthCheck = require("../middlewares/Auth.middleware");


// Creat Quiz
router.post("/creat",AuthCheck,creatQuiz);

// Get user quiz by id
router.get("/byid/:id",getQuizbyID)

// Get all user quiz
router.get("/all" , AuthCheck ,getUserAllQuiz )
// Supmit Quiz
router.post("/submit",AuthCheck, submitQuiz)

// update quiz
router.put("/update/:id", AuthCheck, editQuiz);

// Delete Quiz
router.delete("/delete/:id", AuthCheck, deleteQuiz);




module.exports = router;
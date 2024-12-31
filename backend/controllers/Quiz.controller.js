const mongoose = require("mongoose");
const QuizModel = require("../models/Quiz.model");
const QuestionModel = require("../models/Question.model");
const ResultModel = require("../models/Result.model");
const UserModel = require("../models/User.model");

// Create quiz
const creatQuiz = async (req, res) => {
  try {
    const { title, description, questions, userid,role } = req.body;
    const userobjid = new mongoose.Types.ObjectId(userid);
    if(role !== "admin"){
      return res.status(400).json({
        error:true,
        message:"you are not authorized"
      })
    }
    const questionobjid = questions.map(
      (questionid) => new mongoose.Types.ObjectId(questionid)
    );
    const quiz = await QuizModel.create({
      title: title,
      description: description,
      questions: questionobjid,
      user: userobjid,
    });
    res.status(200).json({
      error: false,
      message: "Question success fully uploded",
      quiz: quiz,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// Get one quiz by ID
const getQuizbyID = async (req, res) => {
  try {
    const quizId = req.params.id;

    const quiz = await QuizModel.findById({
      _id: quizId,
      
    });
    if (!quiz) {
      return res.status(4001).json({
        error: true,
        message: "You are not authorized",
      });
    }
    const questionids = quiz.questions;
    const questions = await QuestionModel.find({
      _id: { $in: questionids },
    });

    res.status(200).json({
      error: false,
      quiz: quiz,
      questions: questions,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      message: "internal server error",
    });
  }
};

// Get Uer all Quiz
const getUserAllQuiz = async (req, res) => {
  try {
    const { userid, role } = req.body;
    const userobjid = new mongoose.Types.ObjectId(userid);

    // check if use is admin else if student then send its own data

 
if(role != "admin"){
return res.status(400).json({
  error:true,
  message:"You are not authorized"
})
}


    // Fetch all quizzes created by the user
    const quizzes = await QuizModel.find({ user: userobjid });

    if (!quizzes || quizzes.length === 0) {
      return res.status(404).json({
        error: true,
        message: "No quizzes found for this user",
      });
    }

    // Loop through each quiz and populate questions from QuestionModel
    const quizzesWithQuestions = await Promise.all(
      quizzes.map(async (quiz) => {
        const questions = await QuestionModel.find({
          _id: { $in: quiz.questions },
        });
        return {
          ...quiz.toObject(),
          questions,
        };
      })
    );

    res.status(200).json({
      error: false,
      quizzes: quizzesWithQuestions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// Submit Quiz
const submitQuiz = async (req, res) => {
  try {
    const { quizid, userid, answers } = req.body;

    const quizobjid = new mongoose.Types.ObjectId(quizid);
    const studentobjid = new mongoose.Types.ObjectId(userid);

    let correctAnswersCount = 0;
    for (const answer of answers) {
      const question = await QuestionModel.findById(answer.questionid);
      if (question.correctAnswer === answer.selectedOption) {
        correctAnswersCount++;
      }
    }

    const totalPossibleMarks = answers.length * 2;
    const obtainedMarks = correctAnswersCount * 2;

    const result = {
      quizid: quizobjid,
      studentid: studentobjid,
      totalQuestions: answers.length,
      correctAnswers: correctAnswersCount,
      totalMarks: totalPossibleMarks,
      obtainedMarks: obtainedMarks,
      score: parseFloat(
        ((obtainedMarks / totalPossibleMarks) * 100).toFixed(1)
      ),
    };

    await ResultModel.create(result);

    res.status(200).json({
      error: false,
      message: "Quiz submitted successfully",
      result,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      message: "internal server error",
    });
  }
};

// Edit Quiz
const editQuiz = async (req, res) => {
  try {
    const { title, description, questions, userid,role } = req.body;

    // Convert the `userid` to a MongoDB ObjectId
    const userobjid = new mongoose.Types.ObjectId(userid);
    if(role != "admin"){
      return res.status(400).jaon({
        error:true,
        message:"You are not authorized"
      })
    }

    // Extract question IDs from the `questions` array (assuming there's a `_id` field for each question)
    const questionIds = questions.map((question) => question._id);

    // Update the quiz
    const updatedQuiz = await QuizModel.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        questions: questionIds,
        user: userobjid,
      },
      {
        new: true, // Return the updated document
      }
    );

    // Update the corresponding questions, assuming you're updating the question text or other fields
    const updatedQuestions = await Promise.all(
      questions.map(async (question) => {
       
        if (question._id) {
          return await QuestionModel.findByIdAndUpdate(
            question._id, 
            {
              questionText: question.questionText,
              optionType: question.optionType,
              correctAnswer: question.correctAnswer,
              options: question.options,
            },
            { new: true }
          );
        }
        return null; 
      })
    );

    res.status(200).json({
      error: false,
      updatedQuiz,
      updatedQuestions, 
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// Delete quiz
const deleteQuiz = async (req, res) => {
  try {
    const quizid = req.params.id;
    const { userid,role } = req.body;
    if (userid == null) {
      return res.status(400).json({
        error: true,
        message: "Authentication failed",
      });
    }

    if(role != "admin"){
      return res.status(400).json({
        error:true,
        message:"You are not authorized"
      })
    }
    const userobjid = new mongoose.Types.ObjectId(userid);


    // Find the quiz and ensure it belongs to the user
    const quiz = await QuizModel.findOne({
      _id: quizid,
      user: userobjid,
    });

    

    // If no quiz is found, return an error
    if (!quiz) {
      return res.status(404).json({
        error: true,
        message: "Quiz not found",
      });
    }

    // Extract the question IDs from the quiz
    const questions = quiz.questions;

    // Delete each question by ID, using Promise.all to handle multiple async operations
    if (questions && questions.length > 0) {
      await Promise.all(
        questions.map(async (quizId) => {
          await QuestionModel.findByIdAndDelete(quizId);
        })
      );
    }

    // Delete the quiz itself
    await QuizModel.findByIdAndDelete(quizid);

    // Send a success response
    res.status(200).json({
      error: false, // should be false since there's no error
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

module.exports = {
  creatQuiz,
  getQuizbyID,
  submitQuiz,
  getUserAllQuiz,
  editQuiz,
  deleteQuiz,
};

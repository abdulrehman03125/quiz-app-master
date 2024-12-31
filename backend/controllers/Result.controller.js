const { default: mongoose } = require("mongoose");
const ResultModel = require("../models/Result.model");
const QuizModel = require("../models/Quiz.model");
const UserModel = require("../models/User.model")
const { promise } = require("bcrypt/promises");

// Get student quiz buyid One quiz result

const getonequizRuizresults = async (req, res) => {
  try {
    const { userid } = req.body;
    const quizid = req.params.id;

    const studentobjid = new mongoose.Types.ObjectId(userid);
    const quizobjid = new mongoose.Types.ObjectId(quizid);

    const quizResult = await ResultModel.find({
      quizid: quizobjid,
    
    });


    const studentids = quizResult.map((result) => result.studentid);

    // Fetch the quizzes corresponding to the quizids
    const quizzes = await Promise.all(
      studentids.map(async (studentid) => {
        const student = await UserModel.findById(studentid);
        return student ? student.username : null; // Return the title of the quiz
      })
    );

    const combinedResults = quizResult.map((result, index) => {
      return {
        ...result._doc,
        studentName: quizzes[index], 
      };
    });
//  Get Quiz title
    const quizTitle = await QuizModel.findById(quizobjid);

    if (quizResult == null) {
      return res.status(404).json({
        error: true,
        message: "Quiz result not found",
      });
    }

    res.status(200).json({
      error: false,
      quizResult: combinedResults,
      quizTitle:quizTitle.title,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "internal server error",
    });
  }
};

// Get user all Results

const allResults = async (req, res) => {
  try {
    const { userid, role } = req.body;

    const userobjid = new mongoose.Types.ObjectId(userid);
    
    if (role === "admin") {
      // Fetch all results for the admin
      const results = await ResultModel.find();

      if (results.length === 0) {
        return res.status(404).json({
          error: true,
          message: "Results not found",
        });
      }

      // Get the quiz IDs from the results
      const quizids = results.map((result) => result.quizid);

      // Fetch the quizzes corresponding to the quizids
      const quizzes = await Promise.all(
        quizids.map(async (quizid) => {
          const quiz = await QuizModel.findById(quizid);
          return quiz ? quiz.title : null; 
        })
      );

      // Combine the results with the quiz titles
      const combinedResults = results.map((result, index) => {
        return {
          ...result._doc, 
          quizTitle: quizzes[index], 
        };
      });

      return res.status(200).json({
        error: false,
        quizResult: combinedResults,
      });

    } else if (role !== "admin") {
      // Fetch results for non-admin users (students)
      const results = await ResultModel.find({ studentid: userobjid });

      if (results.length === 0) {
        return res.status(404).json({
          error: true,
          message: "Results not found",
        });
      }

      // Get the quiz IDs from the results
      const quizids = results.map((result) => result.quizid);

      // Fetch the quizzes corresponding to the quizids
      const quizzes = await Promise.all(
        quizids.map(async (quizid) => {
          const quiz = await QuizModel.findById(quizid);
          return quiz ? quiz.title : null; // Return the title of the quiz
        })
      );

      // Combine the results with the quiz titles
      const combinedResults = results.map((result, index) => {
        return {
          ...result._doc, // Spread the result object
          quizTitle: quizzes[index], // Add the quiz title
        };
      });

      return res.status(200).json({
        error: false,
        quizResult: combinedResults, // Return results with quiz titles for students
      });
    }
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// Get allresults of quiz  by id 

const quizAllResults = async(req,res)=>{
try {
  const quizid = req.parems.id;
  const quizobjid = new mongoose.Types.ObjectId(quizid)
  console.log(quizid);
  
  
} catch (error) {
  
}
}

module.exports = {
  getonequizRuizresults,
  allResults,
  quizAllResults
};

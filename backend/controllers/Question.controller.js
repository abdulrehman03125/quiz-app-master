const QuestionModel = require("../models/Question.model")

// Create question
const createQuestion = async(req,res)=>{
try {
    const question = await QuestionModel.create(req.body)
    res.status(200).json({
        error:false,
        message:"Question success fully created",
        question:question
    })
    
    
} catch (error) {
    console.log(error.message);
    res.status(500).json({
        error:true,
        message: "Internal server error"
    })
    
}
}

module.exports = {
    createQuestion,

}
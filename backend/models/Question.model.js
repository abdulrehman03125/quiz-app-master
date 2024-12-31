const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  optionType: {
    type: String,
    required: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  correctAnswer:{
    type:Number,
    required:true
  },
  options : [
    {
      optionid:{
        type:Number,
        required:true
      },
      optionText: {
        type: String,
        required: true,
      },
      isCorrect: {
        type: Boolean,
        default: false,
      },
    },
  ]
},{timestamps:true});

const QuestionModel = mongoose.model("Question", questionSchema);

module.exports =QuestionModel;

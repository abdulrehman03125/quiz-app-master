const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    quizid: {
      type: mongoose.Schema.ObjectId,
      ref: "Quiz",
    },
    studentid: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    correctAnswers: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    obtainedMarks: {
      type: Number,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const ResultModel = mongoose.model("Result", resultSchema);
module.exports = ResultModel;

const mongoose = require("mongoose");

const quizeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref:"User"
    },
    questions: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Question",
      },
    ],
  },
  { timestamps: true }
);

const QuizModel = mongoose.model("Quiz", quizeSchema);

module.exports = QuizModel;

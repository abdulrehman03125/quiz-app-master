const mongoose = require("mongoose")


const userSchema = new mongoose.Schema(
    {
      username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
      },
      email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, "Please provide a valid email"],
      },
      password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password should be at least 6 characters long"],
      },
      role: {
        type: String,
        enum: ["student", "admin"],
        default: "student",
      },
      quizzesTaken: [
        {
          quizId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz",
          },
          score: Number,
          takenAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
    {
      timestamps: true, 
    }
  );

  const UserModel = mongoose.model("User", userSchema);

  module.exports = UserModel;
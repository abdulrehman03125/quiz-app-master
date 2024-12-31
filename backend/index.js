const express = require("express");
const app = express();
const QuestionRoutes = require("./routes/Question.routes")
const QuizRoutes = require("./routes/Quiz.routes")
const UserRouts = require("./routes/User.routes")
const sendEmailrout = require("./routes/Email.routes")
const resultRoutes = require("./routes/Result.routes")
const cors = require("cors");
const mongoose = require("mongoose")
const port = 3007;

require('dotenv').config()

// Middlewares
app.use(express.json());
app.use(cors())

// sendEmailAPI
app.use("/api",sendEmailrout)

// Quiz Result

app.use("/result", resultRoutes)

app.use("/question",QuestionRoutes)
app.use("/quiz" , QuizRoutes)
app.use("/user",UserRouts )


mongoose.connect(process.env.DB_URL)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is starting on port: ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });


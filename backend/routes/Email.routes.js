const express = require("express");
const sendEmail = require("../controllers/Email.controller");
const router = express.Router();

router.post('/send-quiz-link', sendEmail)

module.exports = router;
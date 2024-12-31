
const { sendQuizLink } = require('../sendEmail/sendEmail');

const sendEmail= async (req, res) => {
    const { emails, quizLink } = req.body;
    try {
      await sendQuizLink(emails, quizLink);
      res.status(200).json({ message: 'Emails sent successfully!' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send emails' });
    }
  };


  module.exports = sendEmail;
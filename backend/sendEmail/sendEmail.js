// Import nodemailer
const nodemailer = require("nodemailer");

// Function to send emails
async function sendQuizLink(emails, quizLink) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "chrahman0312@gmail.com", // your email
        pass: "rgrv xuqi jkwx qivz",    // your email password
      },
    });

    const mailOptions = {
      from: '"Quiz Sender" <irfantkd1132@gmail.com>', // sender address
      to: emails, // list of receivers
      subject: "Quiz Link", // Subject line
      text: `You have been invited to participate in a quiz. Click on the link to start: ${quizLink}`, // plain text body
      html: `<p>You have been invited to participate in a quiz. Click on the link below to start:</p><a href="${quizLink}">${quizLink}</a>`, // html body
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
}

module.exports = { sendQuizLink };

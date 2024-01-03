const nodemailer = require("nodemailer");
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD
    }
  });

  const emailWithNodemailer = async(emailData) =>{
    try {
        const mailOptions = {
            from: process.env.SMTP_USERNAME, // sender address
            to: emailData.email, // list of receivers
            subject: emailData.subject, // Subject line
            html: emailData.html, // html body
        }
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent %s", info.response);
    } catch (error) {
        console.error('Error sending mail', error);
        throw error;
    }
  };

  module.exports = emailWithNodemailer;
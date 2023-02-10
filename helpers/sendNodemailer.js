require("dotenv").config();
const nodemailer = require("nodemailer");

const { EMAIL_PASS, EMAIL_USER } = process.env;

async function sendNodemailer({ to, subject, html }) {
  try {
    const email = {
      from: "olga.semenyuta@gmail.com",
      to,
      subject,
      html,
    };

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    const response = await transport.sendMail(email);
  } catch (error) {
    console.log(error);
  }
}

module.exports = { sendNodemailer };

require("dotenv").config();
const sendGrid = require("@sendgrid/mail");
const { API_KEY } = process.env;

async function sendMail({ to, subject, html }) {
  try {
    sendGrid.setApiKey(API_KEY);

    const email = {
      from: "olga.semenyuta@gmail.com",
      to,
      subject,
      html,
    };

    await sendGrid.send(email);
  } catch (error) {
    console.log(error);
  }
}

module.exports = { sendMail };

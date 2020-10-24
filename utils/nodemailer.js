const nodemailer = require("nodemailer");

const emailService = nodemailer.createTransport({
  host: "smtp-relay.sendinblue.com",
  port: 587,
  secure: false,
  auth: {
    user: "*Email*",
    pass: "*Password*",
  },
});

module.exports = emailService;

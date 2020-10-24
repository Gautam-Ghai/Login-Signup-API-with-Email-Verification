const emailService = require("../utils/nodemailer");
const cryptoRandomString = require("crypto-random-string");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/users");
const { cryptoString } = require("../models/cryptoString");
const _ = require("lodash");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send("User can not be created");

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("user already registered");

  user = new User(
    _.pick(req.body, ["name", "email", "password", "encryptPass", "isConfirm"])
  );

  const salt = await bcrypt.genSalt(10);
  user.encryptPass = await bcrypt.hash(user.password, salt);
  await user.save();

  const baseUrl = req.protocol + "://" + req.headers.host;
  const secretCode = cryptoRandomString({ length: 10, type: "url-safe" });

  const newCode = new cryptoString({
    code: secretCode,
    email: user.email,
  });
  await newCode.save();

  const data = {
    from: "gautamghai99@gmail.com",
    to: user.email,
    subject: "Your Activation Link for YOUR APP",
    text: `Please use the following link within the next 10 minutes to activate your account on YOUR APP: ${baseUrl}/demo/verify/${user._id}/${secretCode}`,
  };
  await emailService.sendMail(data);

  // const token = user.generateAuthToken();

  res.send(_.pick(user, ["id", "name", "email", "encryptPass"]));
});

module.exports = router;

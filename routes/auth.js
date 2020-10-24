const passwordComplexity = require("joi-password-complexity");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { User } = require("../models/users");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).send("User with the given Email is not registered");

  const validPassword = await bcrypt.compare(
    req.body.password,
    user.encryptPass
  );
  if (!validPassword) return res.status(400).send("Invalid password");

  const confirm = await User.findOne({
    isConfirm: true,
    email: req.body.email,
  });
  if (!confirm)
    return res.status(400).send("You need to confirm your email to login");

  res.send("LogIn successful");
});

function validateUser(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(200).required().email(),
    password: passwordComplexity({
      min: 8,
      max: 25,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 1,
      requirementCount: 4,
    }).required(),
  });
  return schema.validate(req);
}
module.exports = router;

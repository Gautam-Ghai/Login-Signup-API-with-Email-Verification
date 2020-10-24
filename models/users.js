const mongoose = require("mongoose");
const passwordComplexity = require("joi-password-complexity");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 100,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  encryptPass: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  isConfirm: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isConfirm: this.isConfirm },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
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
    encryptPass: Joi.string(),
    isConfirm: Joi.boolean(),
  });
  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;

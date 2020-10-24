const mongoose = require("mongoose");

const cryptoSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

cryptoSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 });

const cryptoString = mongoose.model("cryptoString", cryptoSchema);

exports.cryptoString = cryptoString;

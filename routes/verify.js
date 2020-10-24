const { User } = require("../models/users");
const { cryptoString } = require("../models/cryptoString");
const express = require("express");
const router = express.Router();

router.get("/:id/:code", async (req, res) => {
  const secretCode = cryptoString.findOne({ code: req.params.code });
  if (!secretCode) return res.status(400).send("Code not found");

  const user = await User.findById(req.params.id);
  if (!user) return res.status(400).send("User not found");

  await User.findByIdAndUpdate(
    req.params.id,
    { isConfirm: true },
    { new: true }
  );

  res.send("User Registered");
});

module.exports = router;

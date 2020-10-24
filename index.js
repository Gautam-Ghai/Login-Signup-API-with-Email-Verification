const users = require("./routes/users");
const auth = require("./routes/auth");
const verify = require("./routes/verify");
const mongoose = require("mongoose");
const express = require("express");
const app = express();

mongoose
  .connect("mongodb://localhost/demo_1", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to the database...!"))
  .catch((err) => console.log("Connection falied...!"));

app.use(express.json());
app.use("/demo/users", users);
app.use("/demo/auth", auth);
app.use("/demo/verify", verify);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

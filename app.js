const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/index");

const { PORT = 3001 } = process.env;

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: "682f3a797ee86b3dca6285b1",
  };
  next();
});
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});

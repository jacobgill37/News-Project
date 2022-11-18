const express = require("express");
const apiRouter = require("./routers/api-router.js");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send({ msg: "Welcome to the news" });
});

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid query datatype" });
  } else if (err.code === "23503") {
    if (err.detail.includes('not present in table "users"')) {
      res.status(404).send({ msg: "Username not found" });
    } else {
      res.status(400).send({ msg: "Bad request" });
    }
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Missing data" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("server error!");
});

module.exports = app;

const express = require("express");
const {
  getTopics,
  getArticles,
  getArticleById,
} = require("./controllers/index.js");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);

app.use((err, req, res, next) => {
  console.log(err);
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid query datatype" });
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

module.exports = app;

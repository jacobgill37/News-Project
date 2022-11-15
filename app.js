const express = require("express");
const {
  getTopics,
  getArticles,
  getArticleById,
  getCommentsOfArticle,
  postComment,
} = require("./controllers/index.js");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsOfArticle);

app.post("/api/articles/:article_id/comments", postComment);

app.use((err, req, res, next) => {
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

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("server error!");
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("server error!");
});

module.exports = app;

const express = require("express");
const { getTopics } = require("./controllers/topics.js");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("api/articles/:article_id", getArticleById);

module.exports = app;

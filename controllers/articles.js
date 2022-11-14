const { fetchArticles } = require("../models/articles.js");

exports.getArticles = (req, res, next) => {
  return fetchArticles().then((articles) => {
    res.send({ articles });
  });
};

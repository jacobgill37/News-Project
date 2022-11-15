const {
  fetchArticles,
  fetchArticleById,
  fetchCommentsOfArticle,
} = require("../models/articles.js");

exports.getArticles = (req, res, next) => {
  return fetchArticles().then((articles) => {
    res.send({ articles });
  });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return fetchArticleById(article_id)
    .then((article) => {
      res.send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsOfArticle = (req, res, next) => {
  const { article_id } = req.params;
  return fetchCommentsOfArticle(article_id)
    .then((comments) => {
      res.send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

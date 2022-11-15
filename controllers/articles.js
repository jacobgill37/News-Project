const {
  fetchArticles,
  fetchArticleById,
  fetchCommentsOfArticle,
  addComment,
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

exports.postComment = (req, res, next) => {
  const newComment = req.body;
  const { article_id } = req.params;
  return addComment(newComment, article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

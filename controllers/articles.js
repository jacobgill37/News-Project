const {
  fetchArticles,
  fetchArticleById,
  fetchCommentsOfArticle,
  addComment,
  updateArticle,
} = require("../models/articles.js");

exports.getArticles = (req, res, next) => {
  const { topic, sort_by, order } = req.query;
  return fetchArticles(topic, sort_by, order).then((articles) => {
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

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const newVotes = req.body;
  return updateArticle(newVotes, article_id)
    .then((article) => {
      res.send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  postArticle,
  getCommentsOfArticle,
  postComment,
  patchArticle,
} = require("../controllers/index.js");

articlesRouter.route("/").get(getArticles).post(postArticle);

articlesRouter.route("/:article_id").get(getArticleById).patch(patchArticle);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsOfArticle)
  .post(postComment);
module.exports = articlesRouter;

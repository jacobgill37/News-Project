const { getTopics } = require("./topics.js");
const {
  getArticles,
  getArticleById,
  getCommentsOfArticle,
  postComment,
  patchArticle,
} = require("./articles.js");

module.exports = {
  getTopics,
  getArticles,
  getArticleById,
  getCommentsOfArticle,
  postComment,
  patchArticle,
};

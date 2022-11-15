const { getTopics } = require("./topics.js");
const {
  getArticles,
  getArticleById,
  getCommentsOfArticle,
  postComment,
} = require("./articles.js");

module.exports = {
  getTopics,
  getArticles,
  getArticleById,
  getCommentsOfArticle,
  postComment,
};

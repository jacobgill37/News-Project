const { getTopics } = require("./topics.js");
const {
  getArticles,
  getArticleById,
  getCommentsOfArticle,
} = require("./articles.js");

module.exports = {
  getTopics,
  getArticles,
  getArticleById,
  getCommentsOfArticle,
};

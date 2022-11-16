const { getTopics } = require("./topics.js");
const { getUsers } = require("./users.js");
const { deleteComment } = require("./comments.js");

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
  getUsers,
  deleteComment,
};

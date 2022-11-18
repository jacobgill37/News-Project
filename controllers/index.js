const { getTopics } = require("./topics.js");
const { getUsers, getUserByUsername } = require("./users.js");
const { deleteComment, patchComment } = require("./comments.js");
const { getEndpoints } = require("./api.js");

const {
  getArticles,
  postArticle,
  getArticleById,
  getCommentsOfArticle,
  postComment,
  patchArticle,
} = require("./articles.js");

module.exports = {
  getTopics,
  getArticles,
  postArticle,
  getArticleById,
  getCommentsOfArticle,
  postComment,
  patchArticle,
  getUsers,
  deleteComment,
  getEndpoints,
  getUserByUsername,
  patchComment,
};

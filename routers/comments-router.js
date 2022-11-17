const commentsRouter = require("express").Router();
const { deleteComment } = require("../controllers/index.js");

commentsRouter.use("/:comment_id", deleteComment);

module.exports = commentsRouter;

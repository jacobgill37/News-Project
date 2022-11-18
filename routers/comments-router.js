const commentsRouter = require("express").Router();
const { deleteComment, patchComment } = require("../controllers/index.js");

commentsRouter.route("/:comment_id").delete(deleteComment).patch(patchComment);

module.exports = commentsRouter;

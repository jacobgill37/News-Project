const topicRouter = require("express").Router();
const { getTopics } = require("../controllers/index.js");

topicRouter.get("/", getTopics);

module.exports = topicRouter;

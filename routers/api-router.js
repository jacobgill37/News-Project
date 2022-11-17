const apiRouter = require("express").Router();
const { getEndpoints } = require("../controllers/index.js");
const {
  topicRouter,
  articlesRouter,
  commentsRouter,
  usersRouter,
} = require("./index.js");

apiRouter.get("/", getEndpoints);
apiRouter.use("/topics", topicRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;

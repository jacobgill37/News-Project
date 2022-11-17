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

apiRouter.get("/seed", (req, res) => {
  process.env.NODE_ENV = "production";
  process.env.DATABASE_URL =
    "postgres://sjbnfswb:FhdEp8sTmI_Smk3MR_xxTgwtL2J83pNH@lucky.db.elephantsql.com/sjbnfswb";
  require("../db/seeds/run-seed.js");
  res.send({
    msg: "Production database seeded",
    URL: process.env.DATABASE_URL,
    env: process.env.NODE_ENV,
  });
});

module.exports = apiRouter;

const usersRouter = require("express").Router();
const { getUsers } = require("../controllers/index.js");

usersRouter.use("/", getUsers);

module.exports = usersRouter;

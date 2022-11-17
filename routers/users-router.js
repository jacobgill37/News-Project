const usersRouter = require("express").Router();
const { getUsers, getUserByUsername } = require("../controllers/index.js");

usersRouter.route("/").get(getUsers);
usersRouter.route("/:username").get(getUserByUsername);

module.exports = usersRouter;

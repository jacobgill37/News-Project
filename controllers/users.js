const { fetchUsers, fetchUserByUsername } = require("../models/users.js");

exports.getUsers = (req, res, next) => {
  return fetchUsers()
    .then((users) => {
      res.send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  return fetchUserByUsername(username)
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

const { fetchUsers } = require("../models/users.js");

exports.getUsers = (req, res, next) => {
  return fetchUsers()
    .then((users) => {
      res.send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

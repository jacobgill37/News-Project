const { fetchTopics } = require("../models/topics.js");

exports.getTopics = (req, res, next) => {
  return fetchTopics()
    .then((topics) => {
      res.send({ topics });
    })
    .catch((err) => {
      console.log(err);
    });
};

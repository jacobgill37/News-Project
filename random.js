exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return fetchArticleById()
    .then((article) => {
      res.send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

exports.fetchArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
      return result.rows[0];
    });
};

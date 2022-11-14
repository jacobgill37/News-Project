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

describe("GET /api/articles/:article_id", () => {
  test("200: should respond with the given article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          body: expect.any(String),
        });
      });
  });
  test("404: Should respond with 404 if passed a non-existent id", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
  test("400: Should respond with 400 if passed a wrong datatype", () => {
    return request(app)
      .get("/api/articles/notANumber")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid query datatype");
      });
  });
});

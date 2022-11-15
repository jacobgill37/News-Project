app.get("/api/articles/:article_id/comments", getCommentsOfArticle);

exports.getCommentsOfArticle = (req, res, next) => {
  const { article_id } = req.params;
  return fetchCommentsOfArticle(article_id)
    .then((comments) => {
      res.send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.fetchCommentsOfArticle = (article_id) => {
  // Check if article_id is valid using previous function
  return this.fetchArticleById(article_id).then(() => {
    db.query(`SELECT * FROM comments WHERE article_id = $1;`, [
      article_id,
    ]).then((result) => {
      return result.rows;
    });
  });
};

describe("GET /api/articles/:article_id/comments", () => {
  test("200: should respond with the comments for the given article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(11);
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          });
        });
      });
  });
  test("should be ordered by date desc", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("404: Should respond with 404 if passed a non-existent id", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
  test("400: Should respond with 400 if passed a wrong datatype", () => {
    return request(app)
      .get("/api/articles/notANumber/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid query datatype");
      });
  });
});

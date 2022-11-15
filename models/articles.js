const db = require("../db/connection.js");

exports.fetchArticles = () => {
  return db
    .query(
      `
      SELECT articles.author, title, articles.article_id,
          topic, articles.created_at, articles.votes,
          COUNT(comments.body) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.author, title, articles.article_id,
          topic, articles.created_at, articles.votes
      ORDER BY articles.created_at DESC;
      `
    )
    .then((result) => {
      return result.rows;
    });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `
    SELECT articles.author, title, articles.article_id,
        topic, articles.created_at, articles.votes, articles.body,
        COUNT(comments.body) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.author, title, articles.article_id,
        topic, articles.created_at, articles.votes;
    `,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return result.rows[0];
    });
};

exports.addComment = (newComment, article_id) => {
  const values = [newComment.body, article_id, newComment.username];
  return this.fetchArticleById(article_id).then(() => {
    return db
      .query(
        `
        INSERT INTO comments
        (body, article_id, author)
        VALUES
        ($1, $2, $3)
        RETURNING *;
        `,
        values
      )
      .then((result) => {
        return result.rows[0];
      });
  });
};

exports.fetchCommentsOfArticle = (article_id) => {
  // Check if article_id is valid using previous function
  return this.fetchArticleById(article_id)
    .then(() => {
      return db.query(
        `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
        [article_id]
      );
    })
    .then((result) => {
      return result.rows;
    });
};

exports.updateArticle = (newVotes, article_id) => {
  return db
    .query(
      `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;
  `,
      [newVotes.inc_votes, article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return result.rows[0];
    });
};

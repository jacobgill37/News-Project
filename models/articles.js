const db = require("../db/connection.js");

exports.fetchArticles = (topic, sort_by = "created_at", order = "DESC") => {
  const values = [];
  const validSort_by = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "comment_count",
  ];
  const validOrder = ["ASC", "DESC", "asc", "desc"];

  if (!validSort_by.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "invalid sort_by query" });
  } else if (!validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "invalid order query" });
  }

  let queryText = `
      SELECT articles.author, title, articles.article_id,
          topic, articles.created_at, articles.votes,
          COUNT(comments.body) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id`;

  if (topic) {
    queryText += " WHERE topic = $1";
    values.push(topic);
  }

  queryText += `
      GROUP BY articles.author, title, articles.article_id,
               topic, articles.created_at, articles.votes
      `;

  queryText += ` ORDER BY ${sort_by} ${order};`;

  return db.query(queryText, values).then((result) => {
    return result.rows;
  });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
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

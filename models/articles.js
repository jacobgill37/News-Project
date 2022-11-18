const db = require("../db/connection.js");
const { checkTopicExists } = require("../db/utils/checkTopicExists.js");

exports.fetchArticles = (
  topic,
  sort_by = "created_at",
  order = "DESC",
  limit = 10,
  p = 0
) => {
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

  let total_countQueryText = "SELECT * FROM articles";
  let total_countValues = [];

  let promises = [];
  if (topic) {
    queryText += " WHERE topic = $3";
    values.push(topic);
    promises.push(checkTopicExists(topic));
    total_countQueryText += " WHERE topic = $1";
    total_countValues.push(topic);
  }

  queryText += `
      GROUP BY articles.author, title, articles.article_id,
               topic, articles.created_at, articles.votes
      `;

  queryText += ` ORDER BY ${sort_by} ${order} LIMIT $1 OFFSET $2;`;
  const offset = p * limit;
  values.unshift(offset);
  values.unshift(limit);

  promises.unshift(db.query(total_countQueryText, total_countValues));
  promises.unshift(db.query(queryText, values));

  return Promise.all(promises).then((result) => {
    return [result[0].rows, result[1].rows.length];
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
    GROUP BY articles.article_id;
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

exports.addArticle = (newArticle) => {
  const { author, title, body, topic } = newArticle;
  const values = [author, title, body, topic];
  const sqlText = `
    INSERT INTO articles
      (author, title, body, topic)
    VALUES
      ($1, $2, $3, $4)
    RETURNING *;
  `;

  return db.query(sqlText, values).then((result) => {
    return this.fetchArticleById(result.rows[0].article_id);
  });
};

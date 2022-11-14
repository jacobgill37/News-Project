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

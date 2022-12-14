const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const endpoints = require("../endpoints.json");

const testData = require("../db/data/test-data/index.js");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("200: should respond with array of topic objects with slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toBe(3);
        body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("200: should respond with array of article objects with all properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(10);
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("200: should sort by date DESC", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: should accept a topic query to filter by", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(1);
        body.articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });
  test("200: should accept a sort_by query, defaults to DESC", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("title", { descending: true });
      });
  });
  test("200: should accept a order query", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at");
      });
  });
  test("200: should accept a limit query", () => {
    return request(app)
      .get("/api/articles?limit=5")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(5);
      });
  });
  test("200: limit query should default to 10 ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(10);
      });
  });
  test('200: should accept a "p" query specifying on which page to start (0 indexed)', () => {
    return request(app)
      .get("/api/articles?p=1")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBeLessThanOrEqual(10);
        expect(body.articles[0]).toMatchObject({
          title: "Am I a cat?",
          topic: "mitch",
          author: "icellusedkars",
          created_at: "2020-01-15T22:21:00.000Z",
          votes: 0,
        });
      });
  });
  test("200: response object should have a total_count property, displaying the total number of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.total_count).toBe(12);
      });
  });
  test("200: queries should work in conjunction", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=comment_count&limit=6&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.total_count).toBe(11);
        expect(body.articles.length).toBeLessThanOrEqual(6);
        expect(body.articles).toBeSortedBy("comment_count");
        body.articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("should return [] if passed topic that exists but has no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual([]);
      });
  });
  test("404: if passed a topic that doesnt exist", () => {
    return request(app)
      .get("/api/articles?topic=noTopic")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Topic not found");
      });
  });
  test("400: if passed invalid sort_by", () => {
    return request(app)
      .get("/api/articles?sort_by=notASort_by")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid sort_by query");
      });
  });
  test("400: if passed invalid order", () => {
    return request(app)
      .get("/api/articles?order=notAnOrder")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid order query");
      });
  });
});

describe("POST /api/articles", () => {
  test("201: should post a new article to the db", () => {
    const newArticle = {
      title: "Living in the shadow of a great man 2",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          title: "Living in the shadow of a great man 2",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          article_id: 13,
          votes: 0,
          created_at: expect.any(String),
          comment_count: "0",
        });
      });
  });
  test("400: if any of the data is missing", async () => {
    const newArticleNoTitle = {
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
    };
    const newArticleNoBody = {
      title: "Living in the shadow of a great man 2",
      topic: "mitch",
      author: "butter_bridge",
    };
    await request(app)
      .post("/api/articles")
      .send(newArticleNoTitle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing data");
      });
    await request(app)
      .post("/api/articles")
      .send(newArticleNoBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing data");
      });
  });
  test("404: if username/author is not in db", async () => {
    const newArticle = {
      title: "Living in the shadow of a great man 2",
      topic: "mitch",
      author: "notInDb",
      body: "I find this existence challenging",
    };
    await request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Username not found");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: should respond with the given article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_id: 1,
          comment_count: "11",
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

describe("GET /api/articles/:article_id/comments", () => {
  test("200: should respond with the comments for the given article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(11);
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            article_id: 1,
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          });
        });
      });
  });
  test("200: should be ordered by date desc", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: should return empty array if article has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
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

describe("POST /api/articles/:article_id/comments", () => {
  test("201: should post a new comment to the database", () => {
    const newComment = {
      username: "icellusedkars",
      body: "Good article",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          article_id: 2,
          comment_id: 19,
          author: "icellusedkars",
          votes: 0,
          created_at: expect.any(String),
          body: "Good article",
        });
      });
  });
  test("404: Should respond with 404 if passed a non-existent id", () => {
    const newComment = {
      username: "icellusedkars",
      body: "Good article",
    };
    return request(app)
      .post("/api/articles/1000/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
  test("400: Should respond with 400 if passed wrong id datatype", () => {
    const newComment = {
      username: "icellusedkars",
      body: "Good article",
    };
    return request(app)
      .post("/api/articles/notANumber/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid query datatype");
      });
  });
  test("400: should respond with 400 if passed a comment with missing data", () => {
    const newComment = {
      username: "icellusedkars",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing data");
      });
  });
  test("404: if passed a username that isnt in the db", () => {
    const newComment = {
      username: "1234",
      body: "body",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Username not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: updates vote count passed positive num", () => {
    const newVotes = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/3")
      .send(newVotes)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 10,
        });
      });
  });
  test("200: updates vote count passed negative num", () => {
    const newVotes = { inc_votes: -10 };
    return request(app)
      .patch("/api/articles/3")
      .send(newVotes)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: -10,
        });
      });
  });
  test("404: Should respond with 404 if passed a non-existent id", () => {
    const newVotes = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/1000")
      .send(newVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
  test("400: Should respond with 400 if passed a wrong datatype", () => {
    const newVotes = { inc_votes: -10 };
    return request(app)
      .patch("/api/articles/notANumber")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid query datatype");
      });
  });
  test("400: if passed inc_votes of non number type ", () => {
    const newVotes = { inc_votes: "notANumber" };
    return request(app)
      .patch("/api/articles/1")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid query datatype");
      });
  });
  test("400: if passed object with no inc_values key", () => {
    const newVotes = { not_inc_votes: 10 };
    return request(app)
      .patch("/api/articles/1")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing data");
      });
  });
});

describe("GET /api/users", () => {
  test("200 responds with array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(4);
        body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200: should respond with correct user object", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toMatchObject({
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });
  test("404: if passed username not in db", () => {
    return request(app)
      .get("/api/users/notAUser")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: should delete comment, returning nothing", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("404: if comment id is non-existent but valid ", () => {
    return request(app)
      .delete("/api/comments/10000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not found");
      });
  });
  test("400: if comment_id is wrong datatype", () => {
    return request(app)
      .delete("/api/comments/badNumber")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid query datatype");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("200: update vote count if passed postive num", () => {
    const newVotes = { inc_votes: 10 };
    return request(app)
      .patch("/api/comments/1")
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: 1,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 26,
          author: "butter_bridge",
          article_id: 9,
          created_at: "2020-04-06T12:17:00.000Z",
        });
      });
  });
  test("200: update vote count if passed negative num", () => {
    const newVotes = { inc_votes: -10 };
    return request(app)
      .patch("/api/comments/1")
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: 1,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 6,
          author: "butter_bridge",
          article_id: 9,
          created_at: "2020-04-06T12:17:00.000Z",
        });
      });
  });
  test("404: if passed a valid but non-existent id", () => {
    const newVotes = { inc_votes: -10 };
    return request(app)
      .patch("/api/comments/1000")
      .send(newVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not found");
      });
  });
  test("400: if passed a non-valid id", () => {
    const newVotes = { inc_votes: -10 };
    return request(app)
      .patch("/api/comments/invalidId")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid query datatype");
      });
  });
  test("400: if passed a request object with no number", () => {
    const newVotes = { inc_votes: "This isn't a number" };
    return request(app)
      .patch("/api/comments/1")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid query datatype");
      });
  });
  test("400: if passed a request object with no inc_votes key", () => {
    const newVotes = { not_inc_votes: 1 };
    return request(app)
      .patch("/api/comments/1")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing data");
      });
  });
});

describe("GET /api", () => {
  test("200: should return a json with all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});

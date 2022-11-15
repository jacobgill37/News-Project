const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");

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
        expect(body.articles.length).toBe(12);
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
  test("400: if passed comment with data of wrong type", () => {
    const newComment = {
      username: 1234,
      body: "body",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
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
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
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

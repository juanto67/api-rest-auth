const request = require("supertest");
const app = require("./index"); // Asegúrate de exportar tu app en index.js
const mongoose = require("mongoose");
const User = require("../models/User");
const Post = require("../models/Post");
const Session = require("../models/Session");

let token;
let cookie;

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/api-rest-auth-test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await User.deleteMany({});
  await Post.deleteMany({});
  await Session.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth & Posts API", () => {
  test("Register user", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ username: "test", email: "test@email.com", password: "123456" });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Usuario registrado/);
  });

  test("Login user and set cookie", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test@email.com", password: "123456" });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
    cookie = res.headers["set-cookie"][0].split(";")[0]; // token cookie
  });

  test("Auto-login with cookie", async () => {
    const res = await request(app)
      .get("/auth/auto-login")
      .set("Cookie", cookie);
    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe("test@email.com");
  });

  test("Create post (authenticated)", async () => {
    const res = await request(app)
      .post("/posts")
      .set("Cookie", cookie)
      .send({ title: "Post 1", content: "Contenido del post" });
    expect(res.statusCode).toBe(200);
    expect(res.body.post.title).toBe("Post 1");
  });

  test("Get all posts", async () => {
    const res = await request(app)
      .get("/posts");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("Get my posts (authenticated)", async () => {
    const res = await request(app)
      .get("/posts/mine")
      .set("Cookie", cookie);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Logout user", async () => {
    const res = await request(app)
      .post("/auth/logout")
      .set("Cookie", cookie);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Sesión cerrada/);
  });
});
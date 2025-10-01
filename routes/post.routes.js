const express = require("express");
const router = express.Router();
const { createPost, getPosts, getMyPosts } = require("../controllers/post.controller");
const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, createPost);
router.get("/", getPosts);
router.get("/mine", verifyToken, getMyPosts);

module.exports = router;
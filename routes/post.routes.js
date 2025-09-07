const express = require("express");
const router = express.Router();
const { createPost, getPosts, getMyPosts } = require("../controllers/post.controller");
const verifyToken = require("../middleware/authMiddleware");

router.get("/", getPosts);
router.get("/me", verifyToken, getMyPosts);
router.post("/", verifyToken, createPost);

module.exports = router;

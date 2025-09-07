const Post = require("../models/Post");

const createPost = (req, res) => {
  const { title, content } = req.body;
  const author = req.user.email;

  if (!title || !content) return res.status(400).json({ error: "Faltan datos" });

  const post = new Post(title, content, author);
  Post.save(post);
  res.json({ message: "Post creado con éxito", post });
};

const getPosts = (req, res) => {
  const posts = Post.getAll();
  res.json(posts);
};

const getMyPosts = (req, res) => {
  const posts = Post.getByAuthor(req.user.email);
  res.json(posts);
};

module.exports = { createPost, getPosts, getMyPosts };


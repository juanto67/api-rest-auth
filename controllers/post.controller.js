const Post = require("../models/Post");

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const author = req.user._id;

    if (!title || !content) return res.status(400).json({ error: "Faltan datos" });

    const newPost = new Post({ title, content, author, fecha: Date.now() });
    await newPost.save();

    res.json({ message: "Post creado con éxito", post: newPost });
  } catch (err) {
    
    res.status(500).json({ error: "Error al crear el post" });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los posts" });
  }
};

const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener tus posts" });
  }
};

module.exports = { createPost, getPosts, getMyPosts };
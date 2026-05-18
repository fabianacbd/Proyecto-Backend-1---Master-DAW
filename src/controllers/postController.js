const Post = require("../models/Post");

// GET /api/posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "name email");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener posts.", error: error.message });
  }
};

// GET /api/posts/:id
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "name email");
    if (!post) return res.status(404).json({ message: "Post no encontrado." });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener post.", error: error.message });
  }
};

// POST /api/posts
const createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const post = await Post.create({ title, content, category, author: req.user._id });
    res.status(201).json({ message: "Post creado.", post });
  } catch (error) {
    res.status(500).json({ message: "Error al crear post.", error: error.message });
  }
};

// PUT /api/posts/:id
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post no encontrado." });

    // Solo el autor o un admin puede editar
    if (req.user.role !== "admin" && post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "No tienes permiso para editar este post." });
    }

    const { title, content, category } = req.body;
    const updated = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, category },
      { new: true, runValidators: true }
    );

    res.json({ message: "Post actualizado.", post: updated });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar post.", error: error.message });
  }
};

// DELETE /api/posts/:id
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post no encontrado." });

    // Solo el autor o un admin puede borrar
    if (req.user.role !== "admin" && post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "No tienes permiso para eliminar este post." });
    }

    await post.deleteOne();
    res.json({ message: "Post eliminado correctamente." });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar post.", error: error.message });
  }
};

module.exports = { getAllPosts, getPostById, createPost, updatePost, deletePost };

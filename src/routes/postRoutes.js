const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdmin } = require("../middlewares/auth");
const { getAllPosts, getPostById, createPost, updatePost, deletePost } = require("../controllers/postController");

// GET /api/posts — público
router.get("/", getAllPosts);

// GET /api/posts/:id — público
router.get("/:id", getPostById);

// POST /api/posts — autenticado
router.post("/", isAuthenticated, createPost);

// PUT /api/posts/:id — autor o admin
router.put("/:id", isAuthenticated, updatePost);

// DELETE /api/posts/:id — autor o admin
router.delete("/:id", isAuthenticated, deletePost);

module.exports = router;

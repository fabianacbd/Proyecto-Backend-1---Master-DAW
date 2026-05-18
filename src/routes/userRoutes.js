const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdmin } = require("../middlewares/auth");
const { upload } = require("../config/cloudinary");
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changeRole,
  addPostToUser,
  removePostFromUser,
} = require("../controllers/userController");

// GET /api/users
router.get("/", isAuthenticated, getAllUsers);

// GET /api/users/:id
router.get("/:id", isAuthenticated, getUserById);

// PUT /api/users/:id — actualizar perfil (imagen opcional)
router.put("/:id", isAuthenticated, upload.single("image"), updateUser);

// DELETE /api/users/:id — eliminar cuenta propia o admin elimina cualquiera
router.delete("/:id", isAuthenticated, deleteUser);

// PATCH /api/users/:id/role — solo admin
router.patch("/:id/role", isAuthenticated, isAdmin, changeRole);

// POST /api/users/:id/posts/:postId — añadir post al usuario (sin duplicados)
router.post("/:id/posts/:postId", isAuthenticated, addPostToUser);

// DELETE /api/users/:id/posts/:postId — quitar post del usuario
router.delete("/:id/posts/:postId", isAuthenticated, removePostFromUser);

module.exports = router;

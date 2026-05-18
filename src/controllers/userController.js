const User = require("../models/User");
const { cloudinary } = require("../config/cloudinary");

// GET /api/users — admin: todos; user: solo él mismo
const getAllUsers = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const users = await User.find().populate("posts");
      return res.json(users);
    }
    const user = await User.findById(req.user._id).populate("posts");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios.", error: error.message });
  }
};

// GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("posts");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado." });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuario.", error: error.message });
  }
};

// PUT /api/users/:id — actualizar datos propios (o admin actualiza cualquiera)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Un user solo puede editar su propio perfil
    if (req.user.role !== "admin" && req.user._id.toString() !== id) {
      return res.status(403).json({ message: "No puedes editar el perfil de otro usuario." });
    }

    const { name, email } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    // Si se sube nueva imagen, eliminar la anterior y guardar la nueva
    if (req.file) {
      const user = await User.findById(id);
      if (user?.imagePublicId) {
        await cloudinary.v2.uploader.destroy(user.imagePublicId);
      }
      updateData.image = req.file.path;
      updateData.imagePublicId = req.file.filename;
    }

    const updated = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: "Usuario no encontrado." });

    res.json({ message: "Usuario actualizado.", user: updated });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar usuario.", error: error.message });
  }
};

// DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Un user solo puede borrar su propia cuenta
    if (req.user.role !== "admin" && req.user._id.toString() !== id) {
      return res.status(403).json({ message: "No puedes eliminar la cuenta de otro usuario." });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado." });

    // Eliminar imagen de Cloudinary si existe
    if (user.imagePublicId) {
      await cloudinary.v2.uploader.destroy(user.imagePublicId);
    }

    await user.deleteOne();
    res.json({ message: "Cuenta eliminada correctamente." });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario.", error: error.message });
  }
};

// PATCH /api/users/:id/role — solo admin puede cambiar roles
const changeRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Rol inválido. Usa 'user' o 'admin'." });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado." });

    res.json({ message: `Rol actualizado a '${role}'.`, user });
  } catch (error) {
    res.status(500).json({ message: "Error al cambiar rol.", error: error.message });
  }
};

// POST /api/users/:id/posts/:postId — añadir post al array (sin duplicados)
const addPostToUser = async (req, res) => {
  try {
    const { id, postId } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado." });

    // Evitar duplicados
    if (user.posts.includes(postId)) {
      return res.status(400).json({ message: "Este post ya está en la lista del usuario." });
    }

    user.posts.push(postId);
    await user.save();

    await user.populate("posts");
    res.json({ message: "Post añadido correctamente.", posts: user.posts });
  } catch (error) {
    res.status(500).json({ message: "Error al añadir post.", error: error.message });
  }
};

// DELETE /api/users/:id/posts/:postId — quitar post del array
const removePostFromUser = async (req, res) => {
  try {
    const { id, postId } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado." });

    user.posts = user.posts.filter((p) => p.toString() !== postId);
    await user.save();

    res.json({ message: "Post eliminado del usuario.", posts: user.posts });
  } catch (error) {
    res.status(500).json({ message: "Error al quitar post.", error: error.message });
  }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser, changeRole, addPostToUser, removePostFromUser };

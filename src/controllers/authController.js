const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { cloudinary } = require("../config/cloudinary");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // Si se subió imagen pero el usuario ya existe, borrarla de Cloudinary
      if (req.file) await cloudinary.v2.uploader.destroy(req.file.filename);
      return res.status(400).json({ message: "El email ya está registrado." });
    }

    const userData = {
      name,
      email,
      password,
      role: "user", // siempre "user" al registrarse
    };

    if (req.file) {
      userData.image = req.file.path;
      userData.imagePublicId = req.file.filename;
    }

    const user = await User.create(userData);
    const token = generateToken(user._id);

    res.status(201).json({
      message: "Usuario registrado correctamente.",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, image: user.image },
    });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar usuario.", error: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Credenciales incorrectas." });
    }

    const token = generateToken(user._id);

    res.json({
      message: "Login exitoso.",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión.", error: error.message });
  }
};

module.exports = { register, login };

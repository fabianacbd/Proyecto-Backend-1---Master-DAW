const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const { upload } = require("../config/cloudinary");

// POST /api/auth/register — con imagen obligatoria
router.post("/register", upload.single("image"), register);

// POST /api/auth/login
router.post("/login", login);

module.exports = router;

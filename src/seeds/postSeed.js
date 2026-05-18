require("dotenv").config({ path: `${__dirname}/../../.env` });
const mongoose = require("mongoose");
const Post = require("../models/Post");
const connectDB = require("../config/db");

const posts = [
  {
    title: "Introducción a Node.js",
    content: "Node.js es un entorno de ejecución de JavaScript en el servidor basado en el motor V8 de Chrome.",
    category: "tecnología",
  },
  {
    title: "¿Qué es MongoDB?",
    content: "MongoDB es una base de datos NoSQL orientada a documentos que almacena datos en formato BSON.",
    category: "tecnología",
  },
  {
    title: "APIs REST con Express",
    content: "Express es un framework minimalista para Node.js que facilita la creación de APIs RESTful.",
    category: "tecnología",
  },
  {
    title: "Autenticación con JWT",
    content: "JSON Web Tokens permiten autenticar usuarios de forma segura y sin estado en el servidor.",
    category: "educación",
  },
  {
    title: "Cloudinary para imágenes",
    content: "Cloudinary es un servicio en la nube para gestionar, transformar y entregar imágenes y vídeos.",
    category: "tecnología",
  },
];

const seed = async () => {
  await connectDB();
  await Post.deleteMany();
  const created = await Post.insertMany(posts);
  console.log(`✅ Seed completado: ${created.length} posts insertados.`);
  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Error en el seed:", err);
  process.exit(1);
});

# Proyecto 1 - Backend

API REST desarrollada con Node.js, Express y MongoDB Atlas. Incluye autenticación con JWT, gestión de roles, subida de imágenes con Cloudinary y CRUD completo de dos colecciones.

---

## Tecnologías utilizadas

- **Node.js** + **Express** — servidor y rutas
- **MongoDB Atlas** + **Mongoose** — base de datos en la nube
- **JWT (jsonwebtoken)** — autenticación stateless
- **bcryptjs** — hash de contraseñas
- **Cloudinary** + **Multer** — subida y eliminación de imágenes
- **dotenv** — variables de entorno

---

## 📁 Estructura del proyecto

```
proyecto-backend/
├── src/
│   ├── config/
│   │   ├── db.js              # Conexión a MongoDB Atlas
│   │   └── cloudinary.js      # Configuración Cloudinary + Multer
│   ├── models/
│   │   ├── User.js            # Modelo de usuarios
│   │   └── Post.js            # Modelo de posts
│   ├── controllers/
│   │   ├── authController.js  # Registro y login
│   │   ├── userController.js  # CRUD usuarios + roles
│   │   └── postController.js  # CRUD posts
│   ├── middlewares/
│   │   └── auth.js            # isAuthenticated + isAdmin
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── postRoutes.js
│   ├── seeds/
│   │   └── postSeed.js        # Semilla para la colección de posts
│   └── index.js               # Entrada principal del servidor
├── .env                       # Variables de entorno
├── .gitignore
├── package.json
└── README.md
```


## Entrega

Proyecto entregado por: **Fabiana Barbati**  
Repositorio: **(shttps://github.com/fabianacbd/Proyecto-Backend-1---Master-DAW.git)**

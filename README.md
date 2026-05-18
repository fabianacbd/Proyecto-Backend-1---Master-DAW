# Proyecto 1 - Backend

API REST desarrollada con Node.js, Express y MongoDB Atlas. Incluye autenticación con JWT, gestión de roles, subida de imágenes con Cloudinary y CRUD completo de dos colecciones.

---

## 🚀 Tecnologías utilizadas

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

---

## ⚙️ Instalación y uso

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd proyecto-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar el archivo `.env`

Edita el archivo `.env` con tus credenciales:

```env
PORT=3000
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster0.xxxxx.mongodb.net/proyecto-backend
JWT_SECRET=tu_secreto_jwt

CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### 4. Ejecutar el seed (opcional)

```bash
npm run seed
```

### 5. Iniciar el servidor

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

---

## 🗃️ Modelos de datos

### User

| Campo         | Tipo       | Descripción                                 |
|---------------|------------|---------------------------------------------|
| name          | String     | Nombre del usuario                          |
| email         | String     | Email único                                 |
| password      | String     | Contraseña hasheada (bcrypt)               |
| role          | String     | `"user"` (por defecto) o `"admin"`         |
| image         | String     | URL de la imagen en Cloudinary              |
| imagePublicId | String     | ID público para eliminar de Cloudinary      |
| posts         | ObjectId[] | Array de posts relacionados (sin duplicados)|

### Post

| Campo    | Tipo     | Descripción                            |
|----------|----------|----------------------------------------|
| title    | String   | Título del post                        |
| content  | String   | Contenido del post                     |
| category | String   | Categoría (tecnología, educación, ...) |
| author   | ObjectId | Referencia al usuario autor            |

---

## 🔐 Autenticación

Todas las rutas protegidas requieren el header:

```
Authorization: Bearer <token>
```

El token se obtiene al registrarse o hacer login.

---

## 📡 Endpoints

### Auth

| Método | Ruta                  | Descripción              | Auth |
|--------|-----------------------|--------------------------|------|
| POST   | `/api/auth/register`  | Registrar usuario + imagen | ❌  |
| POST   | `/api/auth/login`     | Iniciar sesión           | ❌   |

**Registro** — `multipart/form-data`:
```
name, email, password, image (archivo)
```

### Usuarios

| Método | Ruta                            | Descripción                        | Auth    |
|--------|---------------------------------|------------------------------------|---------|
| GET    | `/api/users`                    | Listar usuarios (admin: todos)     | ✅      |
| GET    | `/api/users/:id`                | Ver un usuario                     | ✅      |
| PUT    | `/api/users/:id`                | Actualizar perfil propio           | ✅      |
| DELETE | `/api/users/:id`                | Eliminar cuenta propia / cualquiera| ✅      |
| PATCH  | `/api/users/:id/role`           | Cambiar rol (solo admin)           | ✅ Admin|
| POST   | `/api/users/:id/posts/:postId`  | Añadir post al usuario             | ✅      |
| DELETE | `/api/users/:id/posts/:postId`  | Quitar post del usuario            | ✅      |

### Posts

| Método | Ruta              | Descripción              | Auth |
|--------|-------------------|--------------------------|------|
| GET    | `/api/posts`      | Listar todos los posts   | ❌   |
| GET    | `/api/posts/:id`  | Ver un post              | ❌   |
| POST   | `/api/posts`      | Crear post               | ✅   |
| PUT    | `/api/posts/:id`  | Editar post (autor/admin)| ✅   |
| DELETE | `/api/posts/:id`  | Eliminar post            | ✅   |

---

## 👥 Gestión de roles

- Los nuevos usuarios siempre se crean con rol `"user"`.
- El **primer admin** se crea manualmente en MongoAtlas cambiando el campo `role` a `"admin"`.
- Solo un **admin** puede cambiar el rol de otro usuario (`PATCH /api/users/:id/role`).
- Un usuario con rol `"user"` **no puede** cambiar roles ni borrar cuentas de otros usuarios.

---

## 🖼️ Imágenes con Cloudinary

- Al registrar un usuario se envía una imagen como `multipart/form-data`.
- La imagen se sube automáticamente a Cloudinary con el middleware de Multer.
- Al eliminar un usuario, **su imagen también se elimina de Cloudinary**.

---

## 🌱 Seed

Carga 5 posts de ejemplo en la base de datos:

```bash
npm run seed
```

---

## 🔒 Reglas de negocio

- Un usuario solo puede **eliminar su propia cuenta**.
- Un usuario solo puede **editar su propio perfil**.
- Un admin puede eliminar o editar **cualquier cuenta**.
- El array de posts de un usuario **no admite duplicados**.
- Al añadir un post ya existente, se devuelve un error `400`.

---

## 📬 Entrega

Proyecto entregado por: **[Tu Nombre]**  
Repositorio: **[URL del repositorio GitHub]**

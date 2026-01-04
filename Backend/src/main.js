// ===============================
// CARGA DE DEPENDENCIAS Y CONFIG
// ===============================

// Express: servidor HTTP
const express = require("express");

// CORS: permitir peticiones desde otros orígenes
const cors = require("cors");

// Path: rutas a carpetas (estáticos)
const path = require("node:path");

// Variables de entorno (.env)
require("dotenv").config();

// ===============================
// IMPORTS DE LÓGICA DE LA APP
// ===============================

// Rutas de autenticación (/register, /login)
const authRoutes = require("./routes/auth.routes");

// ===============================
// CREACIÓN Y CONFIGURACIÓN DEL SERVER
// ===============================

// Instancia de Express
const server = express();

// Middlewares globales
server.use(cors());
server.use(express.json({ limit: "25Mb" }));

// ===============================
// REGISTRO DE RUTAS
// ===============================

// Rutas de usuarios y autenticación
server.use("/api/user", authRoutes);

// ===============================
// ARRANQUE DEL SERVIDOR
// ===============================

const port = 3000;
server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

// ===============================
// SERVIDO DE ARCHIVOS ESTÁTICOS (FRONTEND)
// ===============================

server.use(
  express.static(path.join(__dirname, "..", "Frontend", "docs"))
);


// ----------  SECCIÓN DE ENDPOINTS  ----------

/* ENDPOINTS PARA LA API

// GET  /api/animes  -> JSON Array
server.get("/api/animes", async (req, res) => {
  const connection = await getConnection(); // 1. Conectarse a la base de datos.
  const [results] = await connection.query(`SELECT * FROM obras;`); // 2-3. Lanzar la sentencia SQL y obtener los resultados.
  await connection.end(); // 4. Cerrar la conexión con la base de datos.
  res.json(results); // 5. Devolver la información.
});

// GET  /api/animes/:id   -> JSON Objeto
// POST /api/animes  <-- JSON Objeto --> JSON success,id

server.post("/api/animes", async (req, res) => {
  console.log("POST /api/animes. Body:", req.body, " Headers", req.headers);

  const tokenUsuaria = req.headers.authorization.replace("BEARER ", "");

  try {
    const datosUsuaria = jwt.verify(tokenUsuaria, jwtSecret);

    console.log(datosUsuaria);

    const connection = await getConnection();

    const insertAnime = `
    INSERT INTO obras (titulo, descripcion, usuarias_id)
      VALUES (?, ?, ?);`;

    const [result] = await connection.query(insertAnime, [
      req.body.titulo,
      req.body.descripcion,
      datosUsuaria.id,
    ]);

    await connection.end();

    res.json({
      success: true,
      id: result.insertId,
    });
  } catch (err) {
    res.json({
      success: false,
    });
  }
});

*/



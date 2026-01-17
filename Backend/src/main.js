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

// Rutas de frases
const phrasesRoutes = require("./routes/phrases.routes");

// Rutas de usuarios con frases jugadas
const userPhrasesRoutes = require("./routes/user-phrases.routes");

// Rutas para las puntuaciones del juego
const gameRoutes = require("./routes/game.routes");

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

// Rutas para las frases
server.use("/api/phrases", phrasesRoutes);

// Rutas para las frases
server.use("/api/user-phrases", userPhrasesRoutes);

// Rutas para las puntuaciones del juego
server.use("/api/game", gameRoutes);

// ===============================
// SERVIDO DE ARCHIVOS ESTÁTICOS (FRONTEND)
// ===============================

server.use(express.static(path.join(__dirname, "..", "Frontend", "dist")));

// ===============================
// FALLBACK PARA REACT (SPA)
// ===============================

server.get(/^(?!\/api\/).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "Frontend", "dist", "index.html"));
});

// ===============================
// ARRANQUE DEL SERVIDOR
// ===============================

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

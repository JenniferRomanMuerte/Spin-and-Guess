// ----------  SECCION DE IMPORTS  ----------

// Importar la biblioteca de Express

const express = require("express");

// Importar la biblioteca de CORS

const cors = require("cors");

// Importamos path para poder crear rutas a carpetas (de fich. estáticos)

const path = require("node:path");

// Importar la biblioteca de Postgree

const { Pool } = require("pg");

// Importamos la biblioteca de variables de entorno

require("dotenv").config();

// Importamos la biblioteca de contraseñas

const bcrypt = require("bcrypt");
const saltRounds = 10;

// Importamos la biblioteca de tokens
const jwt = require("jsonwebtoken");
const jwtSecret = "secret_key";

// ----------  SECCION DE CONFIGURACIÓN DE EXPRESS  ----------

// Crear una variable con todo lo que puede hacer el servidor:

const server = express();

// Configuramos Express para que funcione bien como API

server.use(cors());
server.use(express.json({ limit: "25Mb" }));

// ----------  SECCION DE CONFIGURACIÓN DE POSTGREE  ----------

// Configuración de Postgree

const pool = new Pool({
  host: process.env.PG_HOST || "localhost",
  port: process.env.PG_PORT || 5432,
  user: process.env.PG_USER || "postgres",
  password: process.env.PG_PASSWORD || "my_password",
  database: process.env.PG_DATABASE || "roulette_game",
});

module.exports = pool;

// ----------  INICIAMOS EXPRESS  ----------
// Arrancar el servidor en el puerto 3000:

const port = 3000;
server.listen(port, () => {
  console.log(`Uh! El servidor ya está arrancado: <http://localhost:${port}/>`);
});

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

// ENDPOINTS PARA REGISTRO Y LOGIN

server.post("/api/user/register", async (req, res) => {
  try {
    if (!req.body.email) {
      return res.status(401).json({
        success: false,
        error: "Falta el email",
      });
    }
    if (!req.body.pass) {
      return res.status(401).json({
        success: false,
        error: "Falta el pass",
      });
    }

    // 2.a Comprobamos si ya existe una usuaria con ese email
    const queryIsEmail = `
    SELECT * FROM users WHERE email =  $1
  `;
    const { rows: existingUsers } = await pool.query(queryIsEmail, [
      req.body.email,
    ]);

    if (existingUsers.length > 0) {
      return res.status(401).json({
        success: false,
        error: "La usuaria ya existe",
      });
    }

    // 2. Preparar INSERT
    const insertOneUser = `
    INSERT INTO users (username, email, password_hash)
      VALUES  ($1, $2, $3)
    RETURNING id;`;

    // 3. Lanzar INSERT

    const encryptedPass = await bcrypt.hash(req.body.pass, saltRounds);

    const { rows } = await pool.query(insertOneUser, [
      req.body.username,
      req.body.email,
      encryptedPass,
    ]);

    // 3. Respuesta de éxito
    res.json({
      success: true,
      user_id: rows[0].id,
    });
  } catch (error) {
    console.error("Error en REGISTER:", error);

    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

server.post("/api/user/login", async (req, res) => {
  try {
    // Compobar los datos que me envían
    if (!req.body.email) {
      return res.status(401).json({
        success: false,
        error: "Falta el email",
      });
    }
    if (!req.body.pass) {
      return res.status(401).json({
        success: false,
        error: "Falta el pass",
      });
    }

    // Buscar usuario por email
    const queryFindUserWithEmail = `
    SELECT *
      FROM users
      WHERE email = $1;`;

    const { rows } = await pool.query(queryFindUserWithEmail, [req.body.email]);

    if (rows.length !== 1) {
      // No existe usuaria con el email que nos envían en el body
      return res.status(401).json({
        success: false,
        error: "Email o contraseña incorrectas",
      });
    }

    const userFound = rows[0];

    // Comparar contraseñas
    const isPasswordOk = await bcrypt.compare(
      req.body.pass,
      userFound.password_hash
    );

    if (!isPasswordOk) {
      return res.status(401).json({
        success: false,
        error: "Email o contraseña incorrectas",
      });
    }

    // Generar token
    const dataToken = {
      id: userFound.id,
      username: userFound.username,
      email: userFound.email,
    };

    const tokenJWT = jwt.sign(dataToken, jwtSecret);

    // Respuesta OK
    return res.json({
      success: true,
      token: tokenJWT,
    });
  } catch (error) {
    console.error("Error en LOGIN:", error);

    return res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

server.post("/api/user/verify", async (req, res) => {});

// SERVIDOR DE ESTÁTICOS PARA REACT

server.use(express.static(path.join(__dirname, "..", "Frontend", "docs")));

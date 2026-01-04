const pool = require("../config/db");
const { hashPassword, comparePassword } = require("../utils/password");
const { generateToken } = require("../utils/jwt");

const register =  async (req, res) => {
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

    const encryptedPass =  await hashPassword(req.body.pass);

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
};


const login = async (req, res) => {
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
    const isPasswordOk = await comparePassword(
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

    const tokenJWT = generateToken(dataToken);

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
};

module.exports = {
  register,
  login,
};
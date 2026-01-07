const pool = require("../config/db");

const getPhrase = async (req, res) => {
  try {
    const userId = req.user.id;

    const query = `
      SELECT
        p.id,
        p.phrase,
        p.clue,
        p.difficulty,
        c.name AS category
      FROM phrases p
      JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
      AND NOT EXISTS (
        SELECT 1
        FROM user_phrases up
        WHERE up.phrase_id = p.id
        AND up.user_id = $1
      )
      ORDER BY RANDOM()
      LIMIT 1;
    `;

    const { rows } = await pool.query(query, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No quedan frases nuevas para este usuario",
      });
    }

    res.json({
      success: true,
      phrase: rows[0],
    });
  } catch (error) {
    console.error("Error obteniendo frase:", error);

    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
};

module.exports = {
  getPhrase,
};

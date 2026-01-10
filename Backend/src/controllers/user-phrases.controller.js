const pool = require("../config/db");

const markPhraseAsPlayed = async (req, res) => {
  try {
    const userId = req.user.id;
    const { phraseId } = req.body;

    // Validación mínima
    if (!phraseId) {
      return res.status(400).json({
        success: false,
        error: "phraseId es obligatorio",
      });
    }

    const query = `
      INSERT INTO user_phrases (user_id, phrase_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, phrase_id) DO NOTHING
    `;

    await pool.query(query, [userId, phraseId]);

    return res.status(201).json({
      success: true,
      message: "Frase marcada como jugada",
    });
  } catch (error) {
    console.error("Error marcando frase como jugada:", error);

    return res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
};

module.exports = {
  markPhraseAsPlayed,
};
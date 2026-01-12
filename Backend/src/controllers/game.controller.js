const pool = require("../config/db");

/******************************************************************
 * 1️Crear partida (guardar score final)
 ******************************************************************/
const createGame = async (req, res) => {
  try {
    const userId = req.user.id;
    const { score, phraseId, result } = req.body;

    // Validaciones
    if (!phraseId) {
      return res.status(400).json({
        success: false,
        error: "phraseId es obligatorio",
      });
    }

    if (!["win", "lose"].includes(result)) {
      return res.status(400).json({
        success: false,
        error: "result debe ser 'win' o 'lose'",
      });
    }

    if (score === undefined || score < 0) {
      return res.status(400).json({
        success: false,
        error: "Score inválido",
      });
    }

    const query = `
      INSERT INTO games (user_id, phrase_id, score, result)
      VALUES ($1, $2, $3, $4)
      RETURNING id, phrase_id, score, result, played_at
    `;

    const { rows } = await pool.query(query, [userId, phraseId, score, result]);

    return res.status(201).json({
      success: true,
      game: rows[0],
    });
  } catch (error) {
    console.error("Error creando partida:", error);

    return res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
};

/******************************************************************
 * Ranking global (mejor puntuación por usuario)
 ******************************************************************/
const getRanking = async (req, res) => {
  try {
    const query = `
      SELECT
        u.username,
        MAX(g.score) AS best_score
      FROM games g
      JOIN users u ON g.user_id = u.id
      WHERE g.result = 'win'
      GROUP BY u.username
      ORDER BY best_score DESC
      LIMIT 10;
    `;

    const { rows } = await pool.query(query);

    return res.json({
      success: true,
      ranking: rows,
    });
  } catch (error) {
    console.error("Error obteniendo ranking:", error);

    return res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
};

/******************************************************************
 * Últimas partidas jugadas
 ******************************************************************/
const getLastGames = async (req, res) => {
  try {
    const query = `
      SELECT
      u.username,
      g.phrase_id,
      g.score,
      g.result,
      g.played_at
    FROM games g
    JOIN users u ON g.user_id = u.id
    ORDER BY g.played_at DESC
    LIMIT 20;
    `;

    const { rows } = await pool.query(query);

    return res.json({
      success: true,
      games: rows,
    });
  } catch (error) {
    console.error("Error obteniendo últimas partidas:", error);

    return res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
};

/******************************************************************
 * Estadísticas del usuario logueado
 ******************************************************************/
const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const query = `
      SELECT
        COUNT(*) AS games_played,
        COUNT(*) FILTER (WHERE result = 'win') AS wins,
        COUNT(*) FILTER (WHERE result = 'lose') AS losses,
        COALESCE(MAX(score), 0) AS best_score,
        COALESCE(AVG(score) FILTER (WHERE result = 'win'), 0)::integer AS avg_score
      FROM games
      WHERE user_id = $1;

    `;

    const { rows } = await pool.query(query, [userId]);

    return res.json({
      success: true,
      stats: rows[0],
    });
  } catch (error) {
    console.error("Error obteniendo estadísticas del usuario:", error);

    return res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
};

module.exports = {
  createGame,
  getRanking,
  getLastGames,
  getUserStats,
};

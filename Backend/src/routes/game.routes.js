const express = require("express");
const gameController = require("../controllers/game.controller");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Crear partida (guardar score final)
router.post("/", authMiddleware, gameController.createGame);

// Ranking global
router.get("/ranking", authMiddleware, gameController.getRanking);

// Últimas partidas jugadas
router.get("/last", authMiddleware, gameController.getLastGames);

// Estadísticas del usuario logueado
router.get("/me/stats", authMiddleware, gameController.getUserStats);

module.exports = router;
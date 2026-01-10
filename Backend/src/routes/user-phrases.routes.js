const express = require("express");
const userPhrasesController = require("../controllers/user-phrases.controller");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Registrar frase jugada por el usuario
router.post("/", authMiddleware, userPhrasesController.markPhraseAsPlayed);

module.exports = router;

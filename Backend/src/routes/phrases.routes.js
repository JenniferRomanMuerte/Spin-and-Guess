const express = require("express");
const phrasesController = require("../controllers/phrases.controller");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, phrasesController.getPhrase);


module.exports = router;
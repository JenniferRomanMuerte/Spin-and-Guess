const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    user: req.user,
  });
});


module.exports = router;

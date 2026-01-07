const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET || "secret_key";

const generateToken = (payload) => {
  return jwt.sign(payload, jwtSecret, {
    expiresIn: "24h",
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, jwtSecret);
};

module.exports = {
  generateToken,
  verifyToken,
};

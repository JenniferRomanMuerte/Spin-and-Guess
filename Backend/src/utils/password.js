const bcrypt = require("bcrypt");
const saltRounds = 10;

const hashPassword = (plainPassword) => {
  return bcrypt.hash(plainPassword, saltRounds);
};

const comparePassword = (plainPassword, hash) => {
  return bcrypt.compare(plainPassword, hash);
};

module.exports = {
  hashPassword,
  comparePassword,
};

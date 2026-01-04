// Importar la biblioteca de Postgree
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.PG_HOST || "localhost",
  port: process.env.PG_PORT || 5432,
  user: process.env.PG_USER || "postgres",
  password: process.env.PG_PASSWORD || "my_password",
  database: process.env.PG_DATABASE || "roulette_game",
});

module.exports = pool;

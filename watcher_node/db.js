const { Pool } = require("pg");
const pool = new Pool();

pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};

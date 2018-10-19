const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;

const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

express()
  .use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .get("/", (req, res) => res.render("pages/index"))
  .get("/db", async (req, res) => {
    try {
      const client = await pool.connect();

      // await client.query("DROP TABLE IF EXISTS test_table ");
      await client.query("CREATE TABLE IF NOT EXISTS test_table (lovely TIMESTAMP)");
      await client.query("INSERT INTO test_table (lovely) VALUES (NOW())");

      const result = await client.query("SELECT * FROM test_table");
      const results = { results: result ? result.rows : null };
      res.render("pages/db", results);
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

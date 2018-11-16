const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;

const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

express()
  .use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .get("/", (req, res) => res.render("pages/index"))
  .get("/db", (req, res) => showDatabase(req, res))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

showDatabase = async (req, res) => {
  try {
    const client = await pool.connect();
    await client.query(
      "create table if not exists test_table (id serial, name text)"
    );
    await client.query("insert into test_table (name) values (NOW())");
    const result = await client.query("SELECT * FROM test_table");
    const results = { results: result ? result.rows : null };
    res.render("pages/db", results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
};

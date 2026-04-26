const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all history
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM shopping_history");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM shopping_history WHERE shopping_history_id = $1",
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// CREATE
router.post("/", async (req, res) => {
  const { shopping_cart_id, date } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO shopping_history (shopping_cart_id, date) VALUES ($1, $2) RETURNING *",
      [shopping_cart_id, date]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      "DELETE FROM shopping_history WHERE shopping_history_id = $1",
      [id]
    );
    res.send("History deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// UPDATE history
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { shopping_cart_id, date } = req.body;

  try {
    const result = await pool.query(
      `UPDATE shopping_history 
       SET shopping_cart_id = $1, date = $2 
       WHERE shopping_history_id = $3 
       RETURNING *`,
      [shopping_cart_id, date, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
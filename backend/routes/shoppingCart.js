const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all carts
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM shopping_cart");
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
      "SELECT * FROM shopping_cart WHERE shopping_cart_id = $1",
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// CREATE
router.post("/", async (req, res) => {
  const { purchase_amount, customer_id } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO shopping_cart (purchase_amount, customer_id) VALUES ($1, $2) RETURNING *",
      [purchase_amount, customer_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { purchase_amount, customer_id } = req.body;

  try {
    await pool.query(
      "UPDATE shopping_cart SET purchase_amount=$1, customer_id=$2 WHERE shopping_cart_id=$3",
      [purchase_amount, customer_id, id]
    );
    res.send("Cart updated");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      "DELETE FROM shopping_cart WHERE shopping_cart_id = $1",
      [id]
    );
    res.send("Cart deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
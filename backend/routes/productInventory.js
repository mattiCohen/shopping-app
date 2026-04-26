const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all inventory
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM product_inventory");
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
      "SELECT * FROM product_inventory WHERE product_inventory_id = $1",
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// CREATE
router.post("/", async (req, res) => {
  const { product_id, quantity } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO product_inventory (product_id, quantity) VALUES ($1, $2) RETURNING *",
      [product_id, quantity]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { product_id, quantity } = req.body;

  try {
    await pool.query(
      "UPDATE product_inventory SET product_id=$1, quantity=$2 WHERE product_inventory_id=$3",
      [product_id, quantity, id]
    );
    res.send("Inventory updated");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      "DELETE FROM product_inventory WHERE product_inventory_id = $1",
      [id]
    );
    res.send("Inventory deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
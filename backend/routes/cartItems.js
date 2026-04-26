const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all cart items
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM cart_items");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET specific cart item
router.get("/:cartId/:productId", async (req, res) => {
  const { cartId, productId } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM cart_items WHERE shopping_cart_id = $1 AND product_id = $2",
      [cartId, productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Cart item not found");
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// CREATE cart item
router.post("/", async (req, res) => {
  const { shopping_cart_id, product_id, quantity } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO cart_items (shopping_cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
      [shopping_cart_id, product_id, quantity || 1]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// UPDATE quantity
router.put("/:cartId/:productId", async (req, res) => {
  const { cartId, productId } = req.params;
  const { quantity } = req.body;

  try {
    const result = await pool.query(
      `UPDATE cart_items 
       SET quantity = $1
       WHERE shopping_cart_id = $2 AND product_id = $3
       RETURNING *`,
      [quantity, cartId, productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Cart item not found");
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE cart item
router.delete("/:cartId/:productId", async (req, res) => {
  const { cartId, productId } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM cart_items WHERE shopping_cart_id = $1 AND product_id = $2 RETURNING *",
      [cartId, productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Cart item not found");
    }

    res.send("Cart item deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
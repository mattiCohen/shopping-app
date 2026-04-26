const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all products
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM product");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET product by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM product WHERE product_id = $1",
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// CREATE product
router.post("/", async (req, res) => {
  const { purchase_price, selling_price, company_id, color, image } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO product (purchase_price, selling_price, company_id, color, image)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [purchase_price, selling_price, company_id, color, image]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// UPDATE product
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { purchase_price, selling_price, company_id, color, image } = req.body;

  try {
    await pool.query(
      `UPDATE product 
       SET purchase_price=$1, selling_price=$2, company_id=$3, color=$4, image=$5
       WHERE product_id=$6`,
      [purchase_price, selling_price, company_id, color, image, id]
    );

    res.send("Product updated");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM product WHERE product_id = $1", [id]);
    res.send("Product deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
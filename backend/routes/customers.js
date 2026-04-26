const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all customers
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM customers");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("שגיאה בשליפת הנתונים");
  }
});

// GET customer by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM customers WHERE customer_id = $1",
      [id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// CREATE customer
router.post("/", async (req, res) => {
  const { email, phone, first_name, last_name, address_id } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO customers (email, phone, first_name, last_name, address_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [email, phone, first_name, last_name, address_id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// UPDATE customer
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { email, phone, first_name, last_name, address_id } = req.body;

  try {
    await pool.query(
      "UPDATE customers SET email = $1, phone = $2, first_name = $3, last_name = $4, address_id = $5 WHERE customer_id = $6",
      [email, phone, first_name, last_name, address_id, id]
    );

    res.send("Customer updated");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE customer
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM customers WHERE customer_id = $1", [id]);
    res.send("Customer deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
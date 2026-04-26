const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all suppliers
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM suppliers");
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
      "SELECT * FROM suppliers WHERE supplier_id = $1",
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// CREATE
router.post("/", async (req, res) => {
  const { phone, first_name, last_name, address_id, company_id } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO suppliers (phone, first_name, last_name, address_id, company_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [phone, first_name, last_name, address_id, company_id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { phone, first_name, last_name, address_id, company_id } = req.body;

  try {
    await pool.query(
      `UPDATE suppliers 
       SET phone=$1, first_name=$2, last_name=$3, address_id=$4, company_id=$5
       WHERE id=$6`,
      [phone, first_name, last_name, address_id, company_id, id]
    );

    res.send("Supplier updated");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM suppliers WHERE supplier_id = $1", [id]);
    res.send("Supplier deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
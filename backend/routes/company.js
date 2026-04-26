const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all companies
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM company");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET company by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM company WHERE company_id = $1",
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// CREATE company
router.post("/", async (req, res) => {
  const { address_id, category } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO company (address_id, category) VALUES ($1, $2) RETURNING *",
      [address_id, category]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// UPDATE company
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { address_id, category } = req.body;

  try {
    await pool.query(
      "UPDATE company SET address_id = $1, category = $2 WHERE company_id = $3",
      [address_id, category, id]
    );
    res.send("Company updated");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE company
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      "DELETE FROM company WHERE company_id = $1",
      [id]
    );
    res.send("Company deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all addresses
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM addresses");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET address by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM addresses WHERE address_id = $1",
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// CREATE address
router.post("/", async (req, res) => {
  const { street, city, building_number } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO addresses (street, city, building_number) VALUES ($1, $2, $3) RETURNING *",
      [street, city, building_number]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// UPDATE address
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { street, city, building_number } = req.body;

  try {
    await pool.query(
      "UPDATE addresses SET street = $1, city = $2, building_number = $3 WHERE address_id = $4",
      [street, city, building_number, id]
    );
    res.send("Address updated");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE address
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      "DELETE FROM addresses WHERE address_id = $1",
      [id]
    );
    res.send("Address deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
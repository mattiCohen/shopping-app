const catchAsync = require('../utils/catchAsync');
const pool = require("../db");
const { handleNotFound } = require('../utils/errors');

// GET all history
const getAllShoppingHistory = catchAsync(async (req, res,next) => {
  const result = await pool.query("SELECT * FROM shopping_history");
  res.json(result.rows);
});

// GET by ID
const getShoppingHistoryById = catchAsync(async (req, res,next) => {
  const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM shopping_history WHERE shopping_history_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return handleNotFound(next, "History not found");
    }
    res.json(result.rows[0]);
  
});

// CREATE
const createShoppingHistory = catchAsync(async (req, res,next) => {
  const { shopping_cart_id, date } = req.body;

    const result = await pool.query(
      "INSERT INTO shopping_history (date, customer_id, first_name, last_name, address_id, phone, email) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [date, customer_id, first_name, last_name, address_id, phone, email]
    );
    res.json(result.rows[0]);
});

// DELETE
const deleteShoppingHistory = catchAsync(async (req, res,next) => {
  const { id } = req.params;
    await pool.query(
      "DELETE FROM shopping_history WHERE shopping_history_id = $1",
      [id]
    );
    if (result.rowCount === 0) {
      return handleNotFound(next, "History not found");
    }
    res.send("History deleted");
 
});

// UPDATE history
const updateShoppingHistory = catchAsync(async (req, res,next) => {
  const { id } = req.params;
  const { date, customer_id, first_name, last_name, address_id, phone, email } = req.body;

    const result = await pool.query(
      `UPDATE shopping_history 
       SET date = $1, customer_id = $2, first_name = $3, last_name = $4, address_id = $5, phone = $6 , email = $7
       WHERE shopping_history_id = $7 
       RETURNING *`,
      [date, customer_id, first_name, last_name, address_id, phone, email]
    );

    if (result.rowCount === 0) {
      return handleNotFound(next, "History not found");
    }

    res.json(result.rows[0]);
 
});

module.exports = {
    getAllShoppingHistory,
    getShoppingHistoryById,
    createShoppingHistory,
    deleteShoppingHistory,
    updateShoppingHistory
};

const catchAsync = require('../utils/catchAsync');
const pool = require("../db");
const { handleNotFound } = require('../utils/errors');

// GET all carts
const getAllCarts = catchAsync(async (req, res,next) => {
  const result = await pool.query("SELECT * FROM shopping_carts");
  res.json(result.rows);
});

// GET by ID
const getCartById = catchAsync(async (req, res,next) => {
  const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM shopping_carts WHERE shopping_cart_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return handleNotFound(next, "Cart not found");
    }
    res.json(result.rows[0]);
 
});

// CREATE
const createCart = catchAsync(async (req, res,next) => {
  const {  customer_id } = req.body;

    const result = await pool.query(
      "INSERT INTO shopping_carts (customer_id) VALUES ($1) RETURNING *",
      [customer_id]
    );
    res.json(result.rows[0]);
 
});

// UPDATE
const updateCart = catchAsync(async (req, res,next) => {
  const { id } = req.params;
  const { purchase_amount, customer_id } = req.body;

    await pool.query(
      "UPDATE shopping_carts SET customer_id=$2 WHERE shopping_cart_id=$3 RETURNING *",
      [ customer_id, id]
    );
    if (result.rowCount === 0) {
      return handleNotFound(next, "Cart not found");
    }
    res.json(result.rows[0]);
 
});

// DELETE
const deleteCart = catchAsync(async (req, res,next) => {
  const { id } = req.params;

    await pool.query(
      "DELETE FROM shopping_cart WHERE shopping_cart_id = $1",
      [id]
    );
    if (result.rowCount === 0) {
      return handleNotFound(next, "Cart not found");
    }
    res.send("Cart deleted");
  
});

module.exports = {
    getAllCarts,
    getCartById,
    createCart,
    updateCart,
    deleteCart
};
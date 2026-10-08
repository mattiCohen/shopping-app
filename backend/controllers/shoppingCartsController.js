const catchAsync = require('../utils/catchAsync');
const pool = require("../db");
const { handleNotFound } = require('../utils/errors');

// GET all carts
const getAllCarts = catchAsync(async (req, res,next) => {
  const result = await pool.query("SELECT * FROM shopping_cart");
  res.json(result.rows);
});

// GET by ID
const getCartById = catchAsync(async (req, res,next) => {
  const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM shopping_cart WHERE shopping_cart_id = $1",
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
const existingCart = await pool.query(
    "SELECT * FROM shopping_cart WHERE customer_id = $1",
    [customer_id]
  );

  if (existingCart.rows.length > 0) {
    const error = new Error("ללקוח זה כבר קיימת עגלת קניות פעילה במערכת");
    error.statusCode = 400; // Bad Request
    return next(error);
  }
    const result = await pool.query(
      "INSERT INTO shopping_cart (customer_id) VALUES ($1) RETURNING *",
      [customer_id]
    );
    res.json(result.rows[0]);
 
});

// DELETE
const deleteCart = catchAsync(async (req, res,next) => {
  const { id } = req.params;

  const result = await pool.query(
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
    deleteCart
};
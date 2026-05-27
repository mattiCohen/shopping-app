const catchAsync = require('../utils/catchAsync');
const pool = require("../db");
const { handleNotFound } = require('../utils/errors');

const getAllCartItems = catchAsync(async (req, res,next) => {
    const result = await pool.query("SELECT * FROM cart_items");
    res.json(result.rows);
});

const getCartItems = catchAsync(async (req, res,next) => {
  const { cartId, productId } = req.params;

    const result = await pool.query(
      "SELECT * FROM cart_items WHERE shopping_cart_id = $1 AND product_id = $2",
      [cartId, productId]
    );

    if (result.rows.length === 0) {
      return handleNotFound(next,'פריט עגלת קנייה לא נמצאה');
    }
    res.json(result.rows[0]);
 
});

const createCartItems = catchAsync(async (req, res,next) => {
  const { shopping_cart_id, product_id, quantity } = req.body;
    const result = await pool.query(
      "INSERT INTO cart_items (shopping_cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
      [shopping_cart_id, product_id, quantity]
    );

    res.json(result.rows[0]);
 
});

const updateCartItems = catchAsync(async (req, res,next) => {
  const { cartId, productId } = req.params;
  const { quantity } = req.body;

    const result = await pool.query(
      `UPDATE cart_items 
       SET quantity = $1
       WHERE shopping_cart_id = $2 AND product_id = $3
       RETURNING *`,
      [quantity, cartId, productId]
    );

    if (result.rows.length === 0) {
      return handleNotFound(next,'פריט עגלת קנייה לא נמצאה');
    }

    res.json(result.rows[0]);

});

const deleteCartItems = catchAsync(async (req, res,next) => {
  const { cartId, productId } = req.params;

    const result = await pool.query(
      "DELETE FROM cart_items WHERE shopping_cart_id = $1 AND product_id = $2 RETURNING *",
      [cartId, productId]
    );

    if (result.rows.length === 0) {
      return handleNotFound(next,'פריט עגלת קנייה לא נמצאה');
    }

    res.send("Cart item deleted");
  
});

module.exports = {
  getAllCartItems,
  getCartItems,
  createCartItems,
  updateCartItems,
  deleteCartItems,
};
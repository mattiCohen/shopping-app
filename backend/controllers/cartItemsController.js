const catchAsync = require('../utils/catchAsync');
const pool = require("../db");
const { handleNotFound } = require('../utils/errors');

const getAllCartItems = catchAsync(async (req, res,next) => {
    const result = await pool.query("SELECT * FROM cart_items");
    res.json(result.rows);
});

const getCartItemsByShoppingCart = catchAsync(async (req, res,next) => {
  const { shopping_cart_id } = req.params;

    const result = await pool.query(
      "SELECT * FROM cart_items WHERE shopping_cart_id = $1",
      [shopping_cart_id]
    );
    if (result.rows.length === 0) {
      return handleNotFound(next,'פריט עגלת קנייה לא נמצאה');
    }
    res.json(result.rows);
});

const getQuantityCartItemsByProduct = catchAsync(async(req,res,next)=>{
const {product_id} = req.params;
const result = await pool.query(
  "SELECT * FROM cart_items WHERE product_id = $1",
  [product_id]
);
const quantity = result.rows.reduce((acc, item) => acc + item.quantity, 0);
if (result.rows.length === 0) {
  return handleNotFound(next,'פריט עגלת קנייה לא נמצאה');
}
res.json({ quantity });
});

const createCartItems = catchAsync(async (req, res,next) => {
  const { shopping_cart_id, product_id, quantity=1 } = req.body;
  const inventoryResult = await pool.query(
    "SELECT quantity FROM product_inventories WHERE product_id = $1",
    [product_id]
  );
  const item_for_shopping_cart_exists = await pool.query(
    "SELECT * FROM cart_items WHERE shopping_cart_id = $1 AND product_id = $2",
    [shopping_cart_id, product_id]
  );
  if (item_for_shopping_cart_exists.rows.length > 0) {
    const error = new Error("פריט זה כבר קיים בעגלת הקנייה");
    error.statusCode = 400;
    return next(error);
  }
  if (inventoryResult.rows.length === 0) {
    const error = new Error("מוצר זה לא נמצא במלאי");
    error.statusCode = 404;
    return next(error);
  }
  const availableStock = inventoryResult.rows[0].quantity;
  if (availableStock === 0) {
    const error = new Error("פריט זה אזל מהמלאי");
    error.statusCode = 400; // Bad Request
    return next(error);
  }
  if (availableStock < quantity) {
    const error = new Error(`אין מספיק מלאי זמין. נותרו רק ${availableStock} יחידות`);
    error.statusCode = 400;
    return next(error);
  }
    const result = await pool.query(
      "INSERT INTO cart_items (shopping_cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
      [shopping_cart_id, product_id, quantity]
    );
    res.json(result.rows[0]);
});

const updateCartItems = catchAsync(async (req, res,next) => {
  const { quantity } = req.body;
  const { id } = req.params;
if (quantity <=0) {
  return res.status(400).json({ error: "Missing required field: quantity" });
}
const product_id=(await pool.query("SELECT product_id FROM cart_items WHERE cart_item_id = $1", [id])).rows[0].product_id;
 const inventoryResult = await pool.query(
    "SELECT quantity FROM product_inventories WHERE product_id = $1",
    [product_id]
  );
    const availableStock = inventoryResult.rows[0].quantity;

  if (availableStock < quantity) {
    const error = new Error(`אין מספיק מלאי זמין. נותרו רק ${availableStock} יחידות`);
    error.statusCode = 400;
    return next(error);
  }
    const result = await pool.query(
      `UPDATE cart_items 
       SET quantity = $1
       WHERE cart_item_id = $2 
       RETURNING *`,
      [quantity, id]
    );

    if (result.rows.length === 0) {
      return handleNotFound(next,'פריט עגלת קנייה לא נמצאה');
    }
    res.json(result.rows[0]);
});

const deleteCartItems = catchAsync(async (req, res,next) => {
  const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM cart_items WHERE cart_item_id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return handleNotFound(next,'פריט עגלת קנייה לא נמצאה');
    }

    res.send("Cart item deleted");
  
});

module.exports = {
  getAllCartItems,
  getQuantityCartItemsByProduct,
  getCartItemsByShoppingCart,
  createCartItems,
  updateCartItems,
  deleteCartItems,
};
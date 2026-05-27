const catchAsync = require('../utils/catchAsync');
const pool = require("../db");
const { handleNotFound } = require('../utils/errors');

// GET all inventory
const getAllInventories = catchAsync(async (req, res,next) => {
    const result = await pool.query("SELECT * FROM product_inventories");
    res.json(result.rows); 
});

// GET by ID
const getInventoryById = catchAsync(async (req, res,next) => {
  const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM product_inventories WHERE product_inventory_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return handleNotFound(next, "Inventory not found");
    }
    res.json(result.rows[0]);
});

// CREATE
const createInventory = catchAsync(async (req, res,next) => {
  const { product_id, quantity } = req.body;
    const result = await pool.query(
      "INSERT INTO product_inventories (product_id, quantity) VALUES ($1, $2) RETURNING *",
      [product_id, quantity]
    );
    res.json(result.rows[0]);
});

// UPDATE
const updateInventory = catchAsync(async (req, res,next) => {
  const { id } = req.params;
  const { product_id, quantity } = req.body;

    await pool.query(
      "UPDATE product_inventories SET product_id=$1, quantity=$2 WHERE product_inventory_id=$3 RETURNING *",
      [product_id, quantity, id]
    );
    if (result.rowCount === 0) {
      return handleNotFound(next, "Inventory not found");
    }
    res.json(result.rows[0]);
});

// DELETE
const deleteInventory = catchAsync(async (req, res,next) => {
  const { id } = req.params;
    await pool.query(
      "DELETE FROM product_inventories WHERE product_inventory_id = $1",
      [id]
    );
    if (result.rowCount === 0) {
      return handleNotFound(next, "Inventory not found");
    }
    res.send("Inventory deleted");
});

module.exports = {
  getAllInventories,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory,
};

const catchAsync = require('../utils/catchAsync');
const pool = require("../db");
const { handleNotFound } = require('../utils/errors');
const { fetchProductsByFilters } = require('../services/productsService');  
const {updateInventoryMinus1, createInventory} = require('../services/productInventoryService');

// GET by ID
const getInventoryByProductId = catchAsync(async (req, res,next) => {
  const { product_id } = req.params;
    const result = await pool.query(
      "SELECT * FROM product_inventories WHERE product_id = $1",
      [product_id]
    );
    if (result.rows.length === 0) {
      return handleNotFound(next, "Inventory not found");
    }
    res.json(result.rows[0]);
});

const getInventoryById = catchAsync(async (req, res,next) => {
  const { product_inventory_id } = req.params;
    const result = await pool.query(
      "SELECT * FROM product_inventories WHERE product_inventory_id = $1",
      [product_inventory_id]
    );
    if (result.rows.length === 0) {
      return handleNotFound(next, "Inventory not found");
    }
    res.json(result.rows[0]);
});

const getInventoryByCategories = catchAsync(async (req, res, next) => {
   const products = await fetchProductsByFilters(req.query);
    if (products.length === 0) {
        return handleNotFound(next, "No products found matching the criteria");
    }
    const productIds = products.map(row => row.product_id); 
    const result_inventories = await pool.query(
        "SELECT * FROM product_inventories WHERE product_id = ANY($1)", 
        [productIds]
    );
    res.json(result_inventories.rows);
});

const createInventory1 = catchAsync(async(req,res,next)=>{
  const {product_id} = req.params;
  const quantity = req.body.quantity;
  const result = await createInventory(product_id,quantity, next);
  res.json(result);
});

// UPDATE
const updateInventoryPlus = catchAsync(async (req, res,next) => {
  const { product_inventory_id } = req.params;
  let { quantity } = req.body;
  const result = await pool.query(
      "SELECT quantity FROM product_inventories WHERE product_inventory_id = $1",
      [product_inventory_id]
    );
    if (result.rows.length === 0) {
      return handleNotFound(next, "Inventory not found");
    }
    quantity += result.rows[0].quantity;
    const result1 = await pool.query(
      "UPDATE product_inventories SET quantity=$1 WHERE product_inventory_id=$2 RETURNING *",
      [quantity,  product_inventory_id]
    );
    if (result1.rowCount === 0) {
      return handleNotFound(next, "Inventory not found");
    }
    res.json(result1.rows[0]);
});

const updateInventoryMinus = catchAsync(async (req, res,next) => {
  const result = await updateInventoryMinus1(req.params.product_inventory_id, req.body.quantity);
  res.json(result);
});

// DELETE
const deleteInventory = catchAsync(async (req, res,next) => {
  const { product_inventory_id } = req.params;
    const result = await pool.query(
      "DELETE FROM product_inventories WHERE product_inventory_id = $1",
      [product_inventory_id]
    );
    if (result.rowCount === 0) {
      return handleNotFound(next, "Inventory not found");
    }
    res.send("Inventory deleted");
});

module.exports = {
  getInventoryByCategories,
  getInventoryByProductId,
  getInventoryById,
  updateInventoryPlus,
  updateInventoryMinus,
  deleteInventory,
  createInventory1
};

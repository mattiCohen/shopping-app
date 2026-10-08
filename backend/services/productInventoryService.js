const pool = require("../db");

const createInventory = async(product_id,quantity) => {
  const result = await pool.query(
      "SELECT * FROM product_inventories WHERE product_id = $1",
      [product_id]
    );
    if (result.rows.length > 0) {
    const error = new Error("Inventory exists for this product. Use update instead.");
    error.statusCode = 400; 
    throw error;
  }
    const result1 = await pool.query(
      "INSERT INTO product_inventories (product_id, quantity) VALUES ($1, $2) RETURNING *",
      [product_id, quantity]
    );

    return result1.rows[0];
};

const updateInventoryMinus1=  async(product_inventory_id, quantity) =>{
  const result = await pool.query(
      "SELECT quantity FROM product_inventories WHERE product_inventory_id = $1",
      [product_inventory_id]
    );
    if (result.rows.length === 0) {
    const error = new Error("Inventory not found");
    error.statusCode = 404;
    throw error;
  }
const currentQuantity = result.rows[0].quantity;
if (currentQuantity < quantity) {
  const error = new Error("Not enough inventory available");
  error.statusCode = 400; // Bad Request
  throw error;
}
const finalQuantity = currentQuantity - quantity;    const result1 = await pool.query(
      "UPDATE product_inventories SET quantity=$1 WHERE product_inventory_id=$2 RETURNING *",
      [quantity,  product_inventory_id]
    );
   if (result1.rowCount === 0) {
    const error = new Error("Inventory not found");
    error.statusCode = 404;
    throw error;
  }
    return result1.rows[0];
};

module.exports = {
    createInventory,
    updateInventoryMinus1
};

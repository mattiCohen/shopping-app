const catchAsync = require('../utils/catchAsync');
const pool = require("../db");
const { handleNotFound } = require('../utils/errors');

// GET all products
const getAllProducts = catchAsync(async (req, res,next) => {
        const result = await pool.query("SELECT * FROM products");
        res.json(result.rows);
    
});

// GET product by ID
const getProductById = catchAsync(async (req, res,next) => {
    const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM products WHERE product_id = $1",
            [id]
        );
        if (result.rows.length === 0) {
            return handleNotFound(next, "Product not found");
        }
        res.json(result.rows[0]);
    
});

// CREATE product
const createProduct = catchAsync(async (req, res,next) => {
    const { purchase_price, selling_price, company_id, color, image } = req.body;

        const result = await pool.query(
            `INSERT INTO products    (purchase_price, selling_price, company_id, color, image)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [purchase_price, selling_price, company_id, color, image]
        );

        res.json(result.rows[0]);
   
});

// UPDATE product
const updateProduct = catchAsync(async (req, res,next) => {
    const { id } = req.params;
    const { purchase_price, selling_price, company_id, color, image } = req.body;
        await pool.query(
            `UPDATE products 
       SET purchase_price=$1, selling_price=$2, company_id=$3, color=$4, image=$5
       WHERE product_id=$6
       RETURNING *`,
            [purchase_price, selling_price, company_id, color, image, id]
        );
        if (result.rowCount === 0) {
            return handleNotFound(next, "Product not found");
        }
        res.json(result.rows[0]);
});

// DELETE product
const deleteProduct = catchAsync(async (req, res,next) => {
    const { id } = req.params;
        await pool.query("DELETE FROM products WHERE product_id = $1", [id]);
        if (result.rowCount === 0) {
            return handleNotFound(next, "Product not found");
        }
        res.send("Product deleted");
});

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
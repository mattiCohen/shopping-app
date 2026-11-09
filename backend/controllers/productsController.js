const catchAsync = require('../utils/catchAsync');
const pool = require("../db");
const { handleNotFound } = require('../utils/errors');
const {fetchProductsByFilters} = require('../services/productsService');
const {createInventory} = require('../services/productInventoryService')

// GET product by ID
const getProductById = catchAsync(async (req, res,next) => {
    const { id } = req.params;

        const result = await pool.query(
"SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON c.category_id = p.category_id WHERE p.product_id = $1"            [id]
        );
        if (result.rows.length === 0) {
            return handleNotFound(next, "Product not found");
        }
        res.json(result.rows[0]);   
});

const getProductsByCategories = catchAsync(async (req, res, next) => {
   const products = await fetchProductsByFilters(req.query);
if (products.length === 0) {
        return res.json([]); // "No products found matching the criteria"
    }
    res.json(products);
});


// CREATE product
const createProduct = catchAsync(async (req, res,next) => {
    const { purchase_price, selling_price, company_id, color, product_name, category_id } = req.body;
    const imagePath = req.file ? req.file.path : null;
        const newProduct = await pool.query(
            `INSERT INTO products    (purchase_price, selling_price, company_id, color, image, product_name, category_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [purchase_price, selling_price, company_id, color, imagePath, product_name, category_id]
        );
        const quantity = 0;
        const productInventory = await createInventory(newProduct.rows[0].product_id, quantity, next);
        res.json(productInventory);
});

// UPDATE product
const updateProduct = catchAsync(async (req, res,next) => {
    const { id } = req.params;
    const { purchase_price, selling_price, company_id, color, category_id, product_name } = req.body;
    const image = COALESCE($5, image);
      const result=  await pool.query(
            `UPDATE products 
       SET purchase_price=$1, selling_price=$2, company_id=$3, color=$4, image=$5, product_name=$6, category_id=$7
       WHERE product_id=$8
       RETURNING *`,
            [purchase_price, selling_price, company_id, color, image, product_name, category_id, id]
        );
        if (result.rowCount === 0) {
            return handleNotFound(next, "Product not found");
        }
        res.json(result.rows[0]);
});

// DELETE product
const deleteProduct = catchAsync(async (req, res,next) => {
    const { id } = req.params;
       const result= await pool.query("DELETE FROM products WHERE product_id = $1", [id]);
        if (result.rowCount === 0) {
            return handleNotFound(next, "Product not found");
        }
        res.send("Product deleted");
});

module.exports = {
    getProductById,
    getProductsByCategories,
    createProduct,
    updateProduct,
    deleteProduct,
};
const pool = require("../db");

const fetchProductsByFilters = async (filters) => {
    const { 
        purchase_price_min, 
        purchase_price_max,
        selling_price_min,      
        selling_price_max,
        company_id,      
        color,
        category,
        product_name          
    } = filters;

    let queryText = "SELECT * FROM products WHERE 1=1";
    const queryValues = [];
    let paramIndex = 1;

    if (purchase_price_min) {
        queryText += ` AND purchase_price >= $${paramIndex}`;
        queryValues.push(purchase_price_min);
        paramIndex++;
    }
    if (purchase_price_max) {
        queryText += ` AND purchase_price <= $${paramIndex}`;
        queryValues.push(purchase_price_max);
        paramIndex++;
    }

    if (selling_price_min) {
        queryText += ` AND selling_price >= $${paramIndex}`;
        queryValues.push(selling_price_min);
        paramIndex++;
    }
    if (selling_price_max) {
        queryText += ` AND selling_price <= $${paramIndex}`;
        queryValues.push(selling_price_max);
        paramIndex++;
    }

    if (company_id) {
        queryText += ` AND company_id = $${paramIndex}`;
        queryValues.push(company_id);
        paramIndex++;
    }
    if (color) {
        queryText += ` AND color ILIKE $${paramIndex}`;
        queryValues.push(`%${color}%`); // מומלץ להוסיף % לחיפוש גמיש ב-ILIKE
        paramIndex++;
    }
    if (category) {
        queryText += ` AND category ILIKE $${paramIndex}`;
        queryValues.push(`%${category}%`);
        paramIndex++;
    }
    if (product_name) {
        queryText += ` AND product_name ILIKE $${paramIndex}`;
        queryValues.push(`%${product_name}%`);
        paramIndex++;
    } 

    const result = await pool.query(queryText, queryValues);
    return result.rows;
};

module.exports = {
    fetchProductsByFilters
};
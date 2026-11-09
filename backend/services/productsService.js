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

let queryText = `SELECT p.*, c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON c.category_id = p.category_id
    WHERE 1=1`;
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
       if (category && Number.isInteger(Number(category))) {
        queryText += ` AND p.category_id IN (
            WITH RECURSIVE tree AS (
                SELECT category_id FROM categories WHERE category_id = $${paramIndex}
                UNION ALL
                SELECT c2.category_id FROM categories c2
                JOIN tree t ON c2.parent_id = t.category_id
            )
            SELECT category_id FROM tree
        )`;
        queryValues.push(Number(category));
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
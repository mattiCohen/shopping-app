const catchAsync = require('../utils/catchAsync');
const pool = require("../db");
const { handleNotFound } = require('../utils/errors');

// GET all suppliers
const getAllSuppliers = catchAsync(async (req, res,next) => {
    const result = await pool.query("SELECT * FROM suppliers");
    res.json(result.rows);
});

// GET by ID
const getSupplierById = catchAsync(async (req, res,next) => {
  const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM suppliers WHERE supplier_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return handleNotFound(next, "Supplier not found");
    }
    res.json(result.rows[0]);
});

// CREATE
const createSupplier = catchAsync(async (req, res,next) => {
  const { phone, first_name, last_name, address_id, company_id } = req.body;

    const result = await pool.query(
      `INSERT INTO suppliers (phone, first_name, last_name, address_id, company_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [phone, first_name, last_name, address_id, company_id]
    );

    res.json(result.rows[0]);
 
});

// UPDATE
const updateSupplier = catchAsync(async (req, res,next) => {
  const { id } = req.params;
  const { phone, first_name, last_name, address_id, company_id } = req.body;

  
    await pool.query(
      `UPDATE suppliers 
       SET phone=$1, first_name=$2, last_name=$3, address_id=$4, company_id=$5
       WHERE supplier_id=$6
       RETURNING *`,
      [phone, first_name, last_name, address_id, company_id, id]
    );

    if (result.rowCount === 0) {
      return handleNotFound(next, "Supplier not found");
    }

    res.json(result.rows[0]);
  
});

// DELETE
const deleteSupplier = catchAsync(async (req, res,next) => {
  const { id } = req.params;

    await pool.query("DELETE FROM suppliers WHERE supplier_id = $1", [id]);
    if (result.rowCount === 0) {
      return handleNotFound(next, "Supplier not found");
    }
    res.send("Supplier deleted");
  
});

module.exports = {
  getAllSuppliers,
  getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier,
};


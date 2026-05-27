const catchAsync = require('../utils/catchAsync');
const pool = require("../db");
const { handleNotFound } = require('../utils/errors');

// GET all companies
const getAllCompanies = catchAsync(async (req, res,next) => {
    const result = await pool.query("SELECT * FROM companies");
    res.json(result.rows);
  
});

// GET company by ID
const getCompanyById = catchAsync(async (req, res,next) => {
  const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM companies WHERE company_id = $1",
      [id]
    );
    if (!result.rows[0]) {
      return handleNotFound(next,'חברה לא נמצאה');
    }
    res.json(result.rows[0]);
  
});

// CREATE company
const createCompany = catchAsync(async (req, res,next) => {
  const { address_id, category,name } = req.body;

    const result = await pool.query(
      "INSERT INTO companies (address_id, category,name) VALUES ($1, $2,$3) RETURNING *",
      [address_id, category,name]
    );
    res.json(result.rows[0]);
 
});

// UPDATE company
const updateCompany = catchAsync(async (req, res,next) => {
  const { id } = req.params;
  const { address_id, category,name } = req.body;

    await pool.query(
      "UPDATE companies SET address_id = $1, category = $2,name = $3 WHERE company_id = $4 RETURNING *",
      [address_id, category,name, id]
    );
    if (!result.rows[0]) {
      return handleNotFound(next,'חברה לא נמצאה');
    }
    res.json(result.rows[0]);
});

// DELETE company
const deleteCompany = catchAsync(async (req, res,next) => {
  const { id } = req.params;

    await pool.query(
      "DELETE FROM companies WHERE company_id = $1",
      [id]
    );
    if (!result.rows[0]) {
      return handleNotFound(next,'חברה לא נמצאה');
    }
    res.send("Company deleted");
 
});

module.exports = 
{
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany
};
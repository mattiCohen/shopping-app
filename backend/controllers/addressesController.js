const catchAsync = require('../utils/catchAsync');
const pool = require("../db");
const { handleNotFound } = require('../utils/errors');
// GET all addresses
const getAllAddresses = catchAsync(async (req, res, next) => {
    const result = await pool.query("SELECT * FROM addresses");
    res.json(result.rows);
});

// GET address by ID
const getAddressById = catchAsync(async (req, res,next) => {
  const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM addresses WHERE address_id = $1",
      [id]
    );
    if (!result.rows[0]) {
    return handleNotFound(next,'כתובת לא נמצאה');
  }
    res.json(result.rows[0]);
});

// CREATE address
const createAddress = catchAsync(async (req, res, next) => {
  const { street, city, building_number } = req.body;
    const result = await pool.query(
      "INSERT INTO addresses (street, city, building_number) VALUES ($1, $2, $3) RETURNING *",
      [street, city, building_number]
    );
    res.json(result.rows[0]);
});

// UPDATE address
const updateAddress = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { street, city, building_number } = req.body;
    await pool.query(
      "UPDATE addresses SET street = $1, city = $2, building_number = $3 WHERE address_id = $4 RETURNING *",
      [street, city, building_number, id]
    );
    if (!result.rows[0]) {
    return handleNotFound(next,'כתובת לא נמצאה');
  }
   res.json(result.rows[0]);
});

// DELETE address
const deleteAddress = catchAsync(async (req, res, next) => {
  const { id } = req.params;
    await pool.query(
      "DELETE FROM addresses WHERE address_id = $1",
      [id]
    );
    if (!result.rows[0]) {
    return handleNotFound(next,'כתובת לא נמצאה');
  }
    res.send("Address deleted"); 
});

module.exports = {
  getAllAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
};
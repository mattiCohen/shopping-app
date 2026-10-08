const catchAsync = require('../utils/catchAsync');
const pool = require("../db");
const { handleNotFound } = require('../utils/errors');
const { findOrCreateAddress, updateAddress} = require("../services/addressService")

// GET all customers
const getAllCustomers = catchAsync(async (req, res,next) => {
    const result = await pool.query("SELECT * FROM customers");
    res.json(result.rows);
});

// GET customer by ID
const getCustomerById = catchAsync(async (req, res,next) => {
  const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM customers WHERE customer_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return handleNotFound(next, "Customer not found");
    }
    res.json(result.rows[0]);
});

// UPDATE customer
const updateCustomer = catchAsync(async (req, res,next) => {
  const { id } = req.params;
  const { email, phone, first_name, last_name, city, street, building_number } = req.body;
  const addressId = await updateAddress(id, { city, street, building_number });
    const result = await pool.query(
      "UPDATE customers SET email = $1, phone = $2, first_name = $3, last_name = $4 WHERE customer_id = $5 RETURNING *",
      [email, phone, first_name, last_name, id]
    );
if (result.rowCount === 0) {
      return handleNotFound(next, "Customer not found");
    }
    res.json(result.rows[0]);
});

// DELETE customer
const deleteCustomer = catchAsync(async (req, res,next) => {
  const { id } = req.params;

  const result = await pool.query("DELETE FROM customers WHERE customer_id = $1", [id]);
    if (result.rowCount === 0) {
      return handleNotFound(next, "Customer not found");
    }
    res.send("Customer deleted");
 
});

module.exports = {
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
};
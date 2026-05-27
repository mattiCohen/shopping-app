const express = require("express");
const router = express.Router();
const {validateId, validateFieldsCustomer} = require("../middleware/validators/customerValidator");
const {
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
} = require("../controllers/customersController");

router.get("/", getAllCustomers);
router.get("/:id", validateId, getCustomerById);
router.put("/:id", validateId, validateFieldsCustomer, updateCustomer);
router.delete("/:id", validateId, deleteCustomer);

module.exports = router;
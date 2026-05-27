const express = require("express");
const router = express.Router();
const {validateId,validateFieldsCompanies} = require("../middleware/validators/companiesValidator");
const {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
} = require("../controllers/companiesController");

router.get("/", getAllCompanies);
router.get("/:id", validateId, getCompanyById);
router.post("/", validateFieldsCompanies, createCompany);
router.put("/:id", validateId, validateFieldsCompanies, updateCompany);
router.delete("/:id", validateId, deleteCompany);


module.exports = router;
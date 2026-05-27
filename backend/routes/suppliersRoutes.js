const express = require("express");
const router = express.Router();
const {validateId,validateFieldsSuppliers}=require("../middleware/validators/suppliersValidator")
const {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier,
} = require("../controllers/suppliersController");

router.get("/", getAllSuppliers);
router.get("/:id", validateId, getSupplierById);
router.post("/", validateFieldsSuppliers, createSupplier);
router.put("/:id", validateId, validateFieldsSuppliers, updateSupplier);
router.delete("/:id", validateId, deleteSupplier);

module.exports = router;
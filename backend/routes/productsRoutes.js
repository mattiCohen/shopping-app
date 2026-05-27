const express = require("express");
const router = express.Router();
const {validateId,validateFieldsProducts} =require("../middleware/validators/productsValidator")
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/productsController");

router.get("/", getAllProducts);
router.get("/:id", validateId, getProductById);
router.post("/", validateFieldsProducts, createProduct);
router.put("/:id", validateId, validateFieldsProducts, updateProduct);
router.delete("/:id", validateId, deleteProduct);

module.exports = router;
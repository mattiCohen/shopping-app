const express = require("express");
const router = express.Router();
const {validateId,validateFieldsProductInventories} =require("../middleware/validators/productInventoriesValidator");
const {
  getAllInventories,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory
} = require("../controllers/productInventoriesController");

router.get("/", getAllInventories);
router.get("/:id",validateId, getInventoryById);
router.post("/", validateFieldsProductInventories, createInventory);
router.put("/:id", validateId, validateFieldsProductInventories, updateInventory);
router.delete("/:id", validateId, deleteInventory);

module.exports = router;

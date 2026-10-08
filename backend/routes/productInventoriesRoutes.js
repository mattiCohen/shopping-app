const express = require("express");
const router = express.Router();
const {validateId,validateProductId,validateFieldsProductInventories} =require("../middleware/validators/productInventoriesValidator");
const {
  getInventoryByProductId,
  getInventoryById,
  getInventoryByCategories,
  updateInventoryPlus,
  updateInventoryMinus,
  deleteInventory,
  createInventory1
} = require("../controllers/productInventoriesController");

router.get("/id/:product_inventory_id",validateId, getInventoryById);
router.get("/", getInventoryByCategories);
router.get("/product_id/:product_id", validateProductId, getInventoryByProductId);
router.post("/:product_id", validateProductId, createInventory1);
router.put("/plus/:product_inventory_id" , validateId, updateInventoryPlus);
router.put("/minus/:product_inventory_id" , validateId, updateInventoryMinus);
router.delete("/:product_inventory_id", validateId, deleteInventory);

module.exports = router;

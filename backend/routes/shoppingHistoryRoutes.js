const express = require("express");
const router = express.Router();
const {validateId,validateFieldsShoppingHistory}=require("../middleware/validators/shoppingHistoryValidator");
const{
  getAllShoppingHistory,
  getShoppingHistoryById,
  createShoppingHistory,
  deleteShoppingHistory,
  updateShoppingHistory
} = require("../controllers/shoppingHistoryController");

router.get("/", getAllShoppingHistory);
router.get("/:id", validateId, getShoppingHistoryById);
router.post("/", validateFieldsShoppingHistory, createShoppingHistory);
router.delete("/:id", validateId, deleteShoppingHistory);
router.put("/:id", validateId, validateFieldsShoppingHistory, updateShoppingHistory);


module.exports = router;
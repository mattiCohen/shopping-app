const express = require("express");
const router = express.Router();
const {validateId,validateFieldsShoppingCarts}=require("../middleware/validators/shoppingCartsValidator");
const {
  getAllCarts,
  getCartById,
  createCart,
  updateCart,
  deleteCart,
} = require("../controllers/shoppingCartsController");

router.get("/", getAllCarts);
router.get("/:id", validateId, getCartById);
router.post("/", validateFieldsShoppingCarts, createCart);
router.put("/:id", validateId, validateFieldsShoppingCarts, updateCart);
router.delete("/:id", validateId, deleteCart);

module.exports = router;
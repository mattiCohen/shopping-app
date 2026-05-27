const express = require("express");
const router = express.Router();
const { validateFieldCartItems, validateId } = require("../middleware/validators/cartItemsValidator");
const {
  getAllCartItems,
  getCartItems,
  createCartItems,
  updateCartItems,
  deleteCartItems,
} = require("../controllers/cartItemsController");

router.get("/", getAllCartItems);
router.get("/:id", validateId, getCartItems);
router.post("/",validateFieldCartItems, createCartItems);
router.put("/:id",validateId,validateFieldCartItems, updateCartItems);
router.delete("/:id", validateId, deleteCartItems);

module.exports = router;
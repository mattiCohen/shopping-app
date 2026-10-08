const express = require("express");
const router = express.Router();
const { validateFieldCartItems, validateId } = require("../middleware/validators/cartItemsValidator");
const {
  getAllCartItems,
  getCartItemsByShoppingCart,
  getQuantityCartItemsByProduct,
  createCartItems,
  updateCartItems,
  deleteCartItems,
} = require("../controllers/cartItemsController");

router.get("/", getAllCartItems);
router.get("/shopping-cart/:shopping_cart_id", getCartItemsByShoppingCart);
router.get("/product/:product_id", getQuantityCartItemsByProduct);
router.post("/",validateFieldCartItems, createCartItems);
router.put("/:id",validateId, updateCartItems);
router.delete("/:id", validateId, deleteCartItems);

module.exports = router;
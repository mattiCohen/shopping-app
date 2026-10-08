const express = require("express");
const router = express.Router();
const { createOrder, getOrderById ,getAllOrders,getOrdersByStatus} = require("../controllers/ordersController");
const { validateCreateOrder, validateOrderId } = require("../middleware/validators/ordersValidator");

router.post("/create", validateCreateOrder, createOrder);
router.get("/", getAllOrders);
router.get("/status", getOrdersByStatus);
router.get("/:order_id", validateOrderId, getOrderById);

module.exports = router;
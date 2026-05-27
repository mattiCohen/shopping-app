const express = require("express");
const router = express.Router();
const { validateFieldsAddress,validateId } = require("../middleware/validators/addressesValidator");
const {
  getAllAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
} = require("../controllers/addressesController");

router.get("/", getAllAddresses);
router.get("/:id",validateId, getAddressById);
router.post("/",validateFieldsAddress, createAddress);
router.put("/:id",validateId,validateFieldsAddress, updateAddress);
router.delete("/:id", validateId, deleteAddress);

module.exports = router;

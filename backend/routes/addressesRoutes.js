const express = require("express");
const router = express.Router();
const { validateFieldsAddress,validateId } = require("../middleware/validators/addressesValidator");
const {
  getAllAddresses,
  getAddressById,
  createAddress1,
  updateAddress,
  deleteAddress,
} = require("../controllers/addressesController");

router.get("/", getAllAddresses);
router.get("/:id",validateId, getAddressById);
router.post("/",validateFieldsAddress, createAddress1);
router.put("/:id",validateId,validateFieldsAddress, updateAddress);
router.delete("/:id", validateId, deleteAddress);

module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require('multer'); 
const path = require('path'); 
const {validateId,validateFieldsProducts} =require("../middleware/validators/productsValidator")
const {
    getProductById,
    getProductsByCategories,
    createProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/productsController");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/'); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
router.get("/", getProductsByCategories);
router.get("/:id", validateId, getProductById);
router.post("/",upload.single('image'), validateFieldsProducts, createProduct);
router.put("/:id", upload.single('image'),validateId, validateFieldsProducts, updateProduct);
router.delete("/:id", validateId, deleteProduct);
module.exports = router;
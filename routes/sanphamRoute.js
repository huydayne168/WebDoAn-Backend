const express = require("express");
const router = express.Router();
const productController = require("../controllers/sanphamController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});

const upload = multer({ storage });

router.get("/api/getallsp", productController.getAllProducts);
router.get("/api/getsp/:ma_san_pham", productController.getProductById);
router.get("/api/getspDM/:ma_danh_muc", productController.getProductByIdDM);
// Accept multipart/form-data with optional files anh_sanpham and anhhover1
router.post(
    "/api/createsp",
    upload.fields([
        { name: "anh_sanpham", maxCount: 1 },
        { name: "anhhover1", maxCount: 1 },
    ]),
    productController.createProduct,
);
router.put(
    "/api/updatesp/:ma_san_pham",
    upload.fields([
        { name: "anh_sanpham", maxCount: 1 },
        { name: "anhhover1", maxCount: 1 },
    ]),
    productController.updateProduct,
);
router.delete("/api/deletesp/:ma_san_pham", productController.deleteProduct);
router.get("/api/searchsp/:searchTerm", productController.searchProductByName);
router.get(
    "/api/searchgdvprice",
    productController.searchServiceByPriceAndName,
);

module.exports = router;

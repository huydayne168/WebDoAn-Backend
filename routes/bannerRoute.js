const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/bannerController");
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

router.get("/api/getallbanner", bannerController.getAllBanners);
router.get("/api/getactivebanner", bannerController.getActiveBanners);
router.get("/api/getbanner/:id_banner", bannerController.getBannerById);
router.post("/api/createbanner", upload.single("image"), bannerController.createBanner);
router.put(
    "/api/updatebanner/:id_banner",
    upload.single("image"),
    bannerController.updateBanner,
);
router.delete("/api/deletebanner/:id_banner", bannerController.deleteBanner);

module.exports = router;

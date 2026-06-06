const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/danhgiaController");

router.get(
    "/api/reviews/product/:ma_san_pham",
    reviewController.getReviewsByProduct,
);
router.post(
    "/api/reviews/product/:ma_san_pham",
    reviewController.createReview,
);

module.exports = router;

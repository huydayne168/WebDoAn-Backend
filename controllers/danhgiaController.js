const Review = require("../model/danhgia");

exports.getReviewsByProduct = (req, res) => {
    const { ma_san_pham } = req.params;

    Review.getByProductId(ma_san_pham, (reviewError, reviews) => {
        if (reviewError) return res.status(500).send(reviewError);

        Review.getSummaryByProductId(ma_san_pham, (summaryError, summary) => {
            if (summaryError) return res.status(500).send(summaryError);

            res.send({
                reviews,
                summary,
            });
        });
    });
};

exports.createReview = (req, res) => {
    const { ma_san_pham } = req.params;
    const { ma_tai_khoan, ten_nguoi_dung, so_sao, noi_dung } = req.body;
    const rating = Number(so_sao);

    if (!ma_tai_khoan || !ten_nguoi_dung) {
        return res.status(400).send("Vui lòng đăng nhập để đánh giá sản phẩm.");
    }

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
        return res.status(400).send("Số sao phải nằm trong khoảng 1 đến 5.");
    }

    if (!noi_dung || !noi_dung.trim()) {
        return res.status(400).send("Vui lòng nhập nội dung đánh giá.");
    }

    Review.create(
        {
            ma_san_pham,
            ma_tai_khoan,
            ten_nguoi_dung,
            so_sao: rating,
            noi_dung: noi_dung.trim(),
        },
        (error, result) => {
            if (error) return res.status(500).send(error);
            res.send({
                message: "Đánh giá sản phẩm thành công.",
                id_danh_gia: result.insertId,
            });
        },
    );
};

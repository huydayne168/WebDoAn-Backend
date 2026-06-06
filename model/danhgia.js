const db = require("../config/config");

const Review = {
    getByProductId: (ma_san_pham, callback) => {
        const sql = `
            SELECT
                dg.id_danh_gia,
                dg.ma_san_pham,
                dg.ma_tai_khoan,
                dg.ten_nguoi_dung,
                dg.so_sao,
                dg.noi_dung,
                dg.ngay_tao
            FROM danh_gia_san_pham dg
            WHERE dg.ma_san_pham = ?
            ORDER BY dg.ngay_tao DESC
        `;

        db.query(sql, [ma_san_pham], (error, result) => {
            if (error) return callback(error);
            callback(null, result);
        });
    },

    getSummaryByProductId: (ma_san_pham, callback) => {
        const sql = `
            SELECT
                COUNT(*) AS totalReviews,
                COALESCE(ROUND(AVG(so_sao), 1), 0) AS averageRating
            FROM danh_gia_san_pham
            WHERE ma_san_pham = ?
        `;

        db.query(sql, [ma_san_pham], (error, result) => {
            if (error) return callback(error);
            callback(null, result[0]);
        });
    },

    create: (reviewData, callback) => {
        const { ma_san_pham, ma_tai_khoan, ten_nguoi_dung, so_sao, noi_dung } =
            reviewData;
        const sql = `
            INSERT INTO danh_gia_san_pham (
                ma_san_pham,
                ma_tai_khoan,
                ten_nguoi_dung,
                so_sao,
                noi_dung
            )
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(
            sql,
            [ma_san_pham, ma_tai_khoan, ten_nguoi_dung, so_sao, noi_dung],
            (error, result) => {
                if (error) return callback(error);
                callback(null, result);
            },
        );
    },
};

module.exports = Review;

const db = require("../config/config");

const Product = {
    getAll: ({ page, pageSize }, callback) => {
        const sqlGet = page
            ? `CALL GetProductsByPage(${page}, ${pageSize});`
            : "SELECT * FROM san_pham";

        db.query(sqlGet, (error, result) => {
            if (error) {
                console.error("Error fetching products:", error);
                return callback(error);
            }
            callback(null, result);
        });
    },

    getById: (ma_san_pham, callback) => {
        const sqlGet = "SELECT * FROM san_pham WHERE ma_san_pham = ?";
        db.query(sqlGet, [ma_san_pham], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    getByIdDM: (ma_danh_muc, callback) => {
        const sqlGet = "SELECT * FROM san_pham WHERE ma_danh_Muc = ?";
        db.query(sqlGet, [ma_danh_muc], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    create: (productData, callback) => {
        const {
            ten_san_pham,
            gia,
            gia_goc,
            so_luong,
            anh_sanpham,
            anhhover1,
            ma_danh_muc,
            mo_ta,
            kich_thuoc,
            thongbao,
        } = productData;

        const sqlInsert = `
        INSERT INTO san_pham (
            ten_san_pham,
            gia,
            gia_goc,
            so_luong,
            mo_ta,
            anh_sanpham,
            anhhover1,
            ma_danh_muc,
            thongbao,
            kich_thuoc
        )
        VALUES (
            ?,?,?,?,?,?,?,?,?,?
        )
    `;

        const values = [
            ten_san_pham,
            gia,
            gia_goc || null,
            so_luong || null,
            mo_ta || null,
            anh_sanpham,
            anhhover1 || null,
            ma_danh_muc,
            thongbao || null,
            kich_thuoc || null,
        ];

        db.query(sqlInsert, values, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    update: (ma_san_pham, productData, callback) => {
        const {
            ten_san_pham,
            gia,
            gia_goc,
            so_luong,
            anh_sanpham,
            anhhover1,
            ma_danh_muc,
            mo_ta,
            kich_thuoc,
            thongbao,
        } = productData;

        const sqlUpdate = `
        UPDATE san_pham SET
            ten_san_pham = ?, 
            gia = ?, 
            gia_goc = ?,
            so_luong = ?,
            anh_sanpham = ?, 
            anhhover1 = ?, 
            ma_danh_muc = ?,  
            mo_ta = ?,
            kich_thuoc = ?,
            thongbao = ?
        WHERE ma_san_pham = ?
    `;

        const values = [
            ten_san_pham,
            gia,
            gia_goc || null,
            so_luong || null,
            anh_sanpham,
            anhhover1,
            ma_danh_muc,
            mo_ta,
            kich_thuoc,
            thongbao,
            ma_san_pham,
        ];

        db.query(sqlUpdate, values, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    delete: (ma_san_pham, callback) => {
        const sqlDelete = "DELETE FROM san_pham WHERE ma_san_pham = ?";
        db.query(sqlDelete, [ma_san_pham], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    searchByName: (searchTerm, callback) => {
        const sqlSearch = "SELECT * FROM san_pham WHERE ten_san_pham LIKE ?";
        const formattedSearchTerm = `%${searchTerm}%`;
        db.query(sqlSearch, [formattedSearchTerm], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    searchByPriceAndName: (minPrice, maxPrice, id_danh_muc, callback) => {
        let sqlSearch = "SELECT * FROM san_pham WHERE gia BETWEEN ? AND ?";
        let queryParams = [minPrice, maxPrice];

        if (id_danh_muc && !isNaN(id_danh_muc)) {
            sqlSearch += " AND ma_danh_muc = ?";
            queryParams.push(id_danh_muc);
        }

        db.query(sqlSearch, queryParams, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
};

module.exports = Product;

const db = require('../config/config');

const Warehouse = {
    getAll: (callback) => {
        const sqlGet = "SELECT * FROM kho_hang";
        db.query(sqlGet, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
    getById: (ma_kho_hang, callback) => {
        const sqlGet = "SELECT * FROM kho_hang WHERE ma_kho_hang = ?";
        db.query(sqlGet, ma_kho_hang, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
create: (warehouseData, callback) => {
    const { ten_san_pham, so_luong, ngay_mua } = warehouseData;
    const sqlInsert = `
        INSERT INTO kho_hang (ten_san_pham, so_luong, ngay_mua) 
        VALUES (?, ?, ?)
    `;
    db.query(sqlInsert, [ten_san_pham, so_luong, ngay_mua], (error, result) => {
        if (error) {
            return callback(error);
        }
        callback(null, result);
    });
},

update: (ma_kho_hang, warehouseData, callback) => {
    const { ten_san_pham, so_luong, ngay_mua } = warehouseData;
    const sqlUpdate = `
        UPDATE kho_hang 
        SET ten_san_pham = ?, so_luong = ?, ngay_mua = ?
        WHERE ma_kho_hang = ?
    `;
    db.query(sqlUpdate, [ten_san_pham, so_luong, ngay_mua, ma_kho_hang], (error, result) => {
        if (error) {
            return callback(error);
        }
        callback(null, result);
    });
},


    delete: (ma_kho_hang, callback) => {
        const sqlDelete = "DELETE FROM kho_hang WHERE ma_kho_hang = ?";
        db.query(sqlDelete, ma_kho_hang, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

     // Thêm hàm tìm kiếm gần đúng
     searchByName: (searchTerm, callback) => {
        const sqlSearch = "SELECT * FROM kho_hang WHERE ten_san_pham LIKE ?";
        const formattedSearchTerm = `%${searchTerm}%`; // Tìm kiếm gần đúng
        db.query(sqlSearch, [formattedSearchTerm], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    }
};

module.exports = Warehouse;

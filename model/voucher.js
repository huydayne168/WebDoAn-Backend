const db = require("../config/config");

const normalizeDiscountType = (discountType) => {
    if (discountType === "amount") return "money";
    return discountType;
};

const Voucher = {
    getAll: (callback) => {
        db.query(
            "SELECT * FROM voucher ORDER BY expiry_date DESC, id_voucher DESC",
            (error, result) => {
                if (error) return callback(error);
                callback(null, result);
            },
        );
    },

    getById: (id_voucher, callback) => {
        db.query(
            "SELECT * FROM voucher WHERE id_voucher = ?",
            [id_voucher],
            (error, result) => {
                if (error) return callback(error);
                callback(null, result);
            },
        );
    },

    create: (voucherData, callback) => {
        const {
            coupon_name,
            discount_type,
            discount_amount,
            remaining_count,
            description,
            value,
            expiry_date,
        } = voucherData;

        const sqlInsert = `
            INSERT INTO voucher (
                coupon_name,
                normalizeDiscountType(discount_type),
                discount_amount,
                remaining_count,
                description,
                value,
                expiry_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
            sqlInsert,
            [
                coupon_name,
                discount_type,
                discount_amount,
                remaining_count,
                description,
                value,
                expiry_date,
            ],
            (error, result) => {
                if (error) return callback(error);
                callback(null, result);
            },
        );
    },

    update: (id_voucher, voucherData, callback) => {
        const {
            coupon_name,
            discount_type,
            discount_amount,
            remaining_count,
            description,
            value,
            expiry_date,
        } = voucherData;

        const sqlUpdate = `
            UPDATE voucher SET
                coupon_name = ?,
                discount_type = ?,
                discount_amount = ?,
                remaining_count = ?,
                description = ?,
                value = ?,
                expiry_date = ?
            WHERE id_voucher = ?
        `;

        db.query(
            sqlUpdate,
            [
                coupon_name,
                normalizeDiscountType(discount_type),
                discount_amount,
                remaining_count,
                description,
                value,
                expiry_date,
                id_voucher,
            ],
            (error, result) => {
                if (error) return callback(error);
                callback(null, result);
            },
        );
    },

    delete: (id_voucher, callback) => {
        db.query(
            "DELETE FROM voucher WHERE id_voucher = ?",
            [id_voucher],
            (error, result) => {
                if (error) return callback(error);
                callback(null, result);
            },
        );
    },
};

module.exports = Voucher;

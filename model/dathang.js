const db = require("../config/config");

const queryAsync = (connection, sql, params = []) =>
    new Promise((resolve, reject) => {
        connection.query(sql, params, (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
    });

const getExistingColumn = async (connection, tableName, candidates) => {
    const columns = await queryAsync(connection, `SHOW COLUMNS FROM ${tableName}`);
    const columnNames = columns.map((column) => column.Field);
    return candidates.find((column) => columnNames.includes(column));
};

const updateProductQuantities = async (connection, orderDetails = []) => {
    const quantityColumn = await getExistingColumn(connection, "san_pham", [
        "so_luong",
        "soluong",
    ]);

    if (!quantityColumn) return;

    for (const item of orderDetails) {
        const productId = Number(item.ma_san_pham);
        const orderQuantity = Number(item.so_luong);

        if (!productId || !Number.isFinite(orderQuantity) || orderQuantity <= 0) {
            continue;
        }

        const productRows = await queryAsync(
            connection,
            `SELECT ${quantityColumn} AS remaining_quantity FROM san_pham WHERE ma_san_pham = ? FOR UPDATE`,
            [productId],
        );

        if (!productRows.length) continue;

        const remainingQuantity = productRows[0].remaining_quantity;
        if (remainingQuantity === null || remainingQuantity === undefined) {
            continue;
        }

        const remainingQuantityNumber = Number(remainingQuantity);
        if (!Number.isFinite(remainingQuantityNumber)) {
            continue;
        }

        if (remainingQuantityNumber < orderQuantity) {
            throw new Error(
                `Sản phẩm ${item.ten_san_pham || productId} không đủ số lượng còn lại.`,
            );
        }

        await queryAsync(
            connection,
            `UPDATE san_pham SET ${quantityColumn} = ${quantityColumn} - ? WHERE ma_san_pham = ?`,
            [orderQuantity, productId],
        );
    }
};

const updateVoucherQuantity = async (connection, orderData) => {
    const voucherId = Number(orderData.id_voucher || orderData.voucher?.id_voucher);
    if (!voucherId) return;

    const remainingColumn = await getExistingColumn(connection, "voucher", [
        "remaining_count",
    ]);

    if (!remainingColumn) return;

    const voucherRows = await queryAsync(
        connection,
        `SELECT ${remainingColumn} AS remaining_count FROM voucher WHERE id_voucher = ? FOR UPDATE`,
        [voucherId],
    );

    if (!voucherRows.length) return;

    const remainingCount = voucherRows[0].remaining_count;
    if (remainingCount === null || remainingCount === undefined) return;

    const remainingCountNumber = Number(remainingCount);
    if (!Number.isFinite(remainingCountNumber)) return;

    if (remainingCountNumber <= 0) {
        throw new Error("Voucher đã hết số lượng.");
    }

    await queryAsync(
        connection,
        `UPDATE voucher SET ${remainingColumn} = ${remainingColumn} - 1 WHERE id_voucher = ?`,
        [voucherId],
    );
};

const Order = {
    addOrder: (orderData, callback) => {
        const {
            ma_khach_hang,
            ngay_dat_hang,
            tong_tien,
            trang_thai,
            ten_khach,
            dia_chi,
            ghi_chu,
            sdt,
            loai_thanh_toan,
            trang_thai_thanh_toan,
            chi_tiet_don_hang,
        } = orderData;

        db.getConnection((connectionError, connection) => {
            if (connectionError) return callback(connectionError);

            connection.beginTransaction(async (transactionError) => {
                if (transactionError) {
                    connection.release();
                    return callback(transactionError);
                }

                try {
                    const orderDetails = Array.isArray(chi_tiet_don_hang)
                        ? chi_tiet_don_hang
                        : [];

                    if (!orderDetails.length) {
                        throw new Error("Đơn hàng chưa có sản phẩm.");
                    }

                    const insertOrderQuery = `
                        INSERT INTO don_hang (
                            ma_khach_hang,
                            ngay_dat_hang,
                            tong_tien,
                            trang_thai,
                            ten_khach,
                            dia_chi,
                            ghi_chu,
                            sdt,
                            loai_thanh_toan,
                            trang_thai_thanh_toan
                        )
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;

                    const orderResult = await queryAsync(connection, insertOrderQuery, [
                        ma_khach_hang,
                        ngay_dat_hang,
                        tong_tien,
                        trang_thai,
                        ten_khach,
                        dia_chi,
                        ghi_chu,
                        sdt,
                        loai_thanh_toan,
                        trang_thai_thanh_toan,
                    ]);

                    const ma_don_hang = orderResult.insertId;
                    const orderDetailsValues = orderDetails.map((item) => [
                        ma_don_hang,
                        item.ma_san_pham,
                        item.ten_san_pham,
                        item.so_luong,
                        item.gia,
                        item.anh_sanpham,
                    ]);

                    await queryAsync(
                        connection,
                        `
                            INSERT INTO chi_tiet_don_hang (
                                ma_don_hang,
                                ma_san_pham,
                                ten_san_pham,
                                so_luong,
                                gia,
                                anh_sanpham
                            )
                            VALUES ?
                        `,
                        [orderDetailsValues],
                    );

                    await updateProductQuantities(connection, orderDetails);
                    await updateVoucherQuantity(connection, orderData);

                    connection.commit((commitError) => {
                        if (commitError) {
                            return connection.rollback(() => {
                                connection.release();
                                callback(commitError);
                            });
                        }

                        connection.release();
                        callback(null, "Thêm đơn hàng thành công");
                    });
                } catch (error) {
                    connection.rollback(() => {
                        connection.release();
                        callback(error);
                    });
                }
            });
        });
    },
};

module.exports = Order;

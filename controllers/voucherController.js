const Voucher = require("../model/voucher");

const normalizeVoucherPayload = (body) => ({
    ...body,
    discount_type: body.discount_type === "amount" ? "money" : body.discount_type,
});

const validateVoucherPayload = (body) => {
    const payload = normalizeVoucherPayload(body);
    const validTypes = ["percent", "money"];

    if (!validTypes.includes(payload.discount_type)) {
        return {
            error: "Loại giảm giá không hợp lệ. Chỉ hỗ trợ percent hoặc money.",
        };
    }

    return { payload };
};

exports.getAllVouchers = (req, res) => {
    Voucher.getAll((err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
};

exports.getVoucherById = (req, res) => {
    const { id_voucher } = req.params;
    Voucher.getById(id_voucher, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
};

exports.createVoucher = (req, res) => {
    const { payload, error } = validateVoucherPayload(req.body);
    if (error) return res.status(400).send(error);

    Voucher.create(payload, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send("Voucher created successfully");
    });
};

exports.updateVoucher = (req, res) => {
    const { id_voucher } = req.params;
    const { payload, error } = validateVoucherPayload(req.body);
    if (error) return res.status(400).send(error);

    Voucher.update(id_voucher, payload, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send("Voucher updated successfully");
    });
};

exports.deleteVoucher = (req, res) => {
    const { id_voucher } = req.params;
    Voucher.delete(id_voucher, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send("Voucher deleted successfully");
    });
};

const Voucher = require("../model/voucher");

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
    Voucher.create(req.body, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send("Voucher created successfully");
    });
};

exports.updateVoucher = (req, res) => {
    const { id_voucher } = req.params;
    Voucher.update(id_voucher, req.body, (err, result) => {
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

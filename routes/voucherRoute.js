const express = require("express");
const router = express.Router();
const voucherController = require("../controllers/voucherController");

router.get("/api/getallvoucher", voucherController.getAllVouchers);
router.get("/api/getvoucher/:id_voucher", voucherController.getVoucherById);
router.post("/api/createvoucher", voucherController.createVoucher);
router.put("/api/updatevoucher/:id_voucher", voucherController.updateVoucher);
router.delete(
    "/api/deletevoucher/:id_voucher",
    voucherController.deleteVoucher,
);

module.exports = router;

const vnpayService = require('../model/vnpay');
const Order = require('../model/dathang');

exports.createPaymentUrl = (req, res) => {
    try {
        const forcedReturnUrl = "https://web-do-an-client.vercel.app/vnpay-return";
        const { paymentUrl, returnUrl } = vnpayService.generatePaymentUrl(
            req,
            forcedReturnUrl,
        );
        return res.status(200).json({ url: paymentUrl, returnUrl });
    } catch (error) {
        console.error("Lỗi tạo URL thanh toán:", error);
        return res.status(500).json({ error: "Lỗi tạo URL thanh toán" });
    }
};

exports.handleVnpayReturn = (req, res) => {
    try {
        const resultCode = vnpayService.verifyReturnUrl(req.query);
        res.render('success', { code: resultCode });
    } catch (error) {
        console.error('Lỗi xác thực URL VNPay:', error);
        res.render('success', { code: '97' }); // 97: checksum không hợp lệ
    }
};

exports.verifyAndAddOrder = (req, res) => {
  try {
    const vnpParams = Object.keys(req.body).reduce((params, key) => {
      if (key.startsWith("vnp_")) {
        params[key] = req.body[key];
      }
      return params;
    }, {});

    const isValid = vnpayService.verifyReturnUrl(vnpParams);
    if (!isValid) return res.json({ success: false, message: "Sai chữ ký hash" });

    if (vnpParams.vnp_ResponseCode === '00') {
      const orderData = req.body.orderData;
      if (!orderData) return res.json({ success: false, message: "Thiếu dữ liệu đơn hàng" });

      Order.addOrder(orderData, (err) => {
        if (err) {
          console.error("Loi luu don hang VNPay:", err);
          return res.json({
            success: false,
            message: err.message || "Luu don hang that bai",
          });
        }
        return res.json({ success: true });
      });
    } else {
      return res.json({ success: false, message: "Thanh toán bị hủy hoặc thất bại" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
  }
};




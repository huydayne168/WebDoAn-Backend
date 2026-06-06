const express = require('express');
const router = express.Router();
const vnpayController = require('../controllers/vnpayController');

router.post('/api/create_payment_url', vnpayController.createPaymentUrl);

router.get('/vnpay_return', vnpayController.handleVnpayReturn);

router.post('/api/vnpay_verify_and_add_order', vnpayController.verifyAndAddOrder);


module.exports = router;

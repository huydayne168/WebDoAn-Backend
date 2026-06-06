const express = require('express');
const router = express.Router();
const orderController = require('../controllers/dathangController');

router.post('/api/addOrder', orderController.addOrder);

module.exports = router;

// route này là đặt hàng ở đây 

const express = require('express');
const router = express.Router();
const accountController = require('../controllers/taikhoanController');

// Tạo mới tài khoản
router.post('/api/createaccount', accountController.createAccount);
router.post('/api/register/send-otp', accountController.sendRegisterOtp);
router.post('/api/register/verify-otp', accountController.verifyRegisterOtp);

// Đăng nhập tài khoản
router.post('/api/login', accountController.loginAccount);

router.get('/api/getalltaikhoan', accountController.getAllAccount);

module.exports = router;

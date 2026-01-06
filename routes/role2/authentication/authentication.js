const express = require('express');
const router = express.Router();
const { signup } = require('../../../controller/role2/authentication/signup');
const { verifyOTP } = require('../../../controller/role2/authentication/verifyOtp');
const { login, getUserInfo } = require('../../../controller/role2/authentication/login');
const { forgotPassword, resetPassword } = require('../../../controller/role2/authentication/forgotPassword');
const { updateUser } = require('../../../controller/role2/authentication/update');
const authenticateJWT = require('../../../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/updatePassword', resetPassword);
router.post('/verify-otp', verifyOTP);
router.get('/info', authenticateJWT, getUserInfo);
router.post('/update',authenticateJWT,updateUser);

module.exports = router;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, OTP } = require('../../../models');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const ejs = require('ejs');
const path = require('path');

// Function to generate OTP
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

// Function to save OTP to database
const saveOTPToDatabase = async (otpCode, userId) => {
    await OTP.create({
        uuid: uuidv4(),
        code: otpCode,
        userId: userId,
    });
};

// Function to configure and send OTP email
const sendOTPEmail = async (email, otpCode) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const templatePath = path.join(__dirname, '../../../templates/otpTemplate.ejs');
    const html = await ejs.renderFile(templatePath, { otpCode });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'SKILLIOS Password Reset OTP',
        html: html
    };

    await transporter.sendMail(mailOptions);
};

// Forgot Password - Send OTP
exports.forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ status: false, message: 'Email is required' });
    }

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ status: false, message: 'Email does not exist in our database' });
        }

        const otpCode = generateOTP();
        await saveOTPToDatabase(otpCode, user.id);
        await sendOTPEmail(user.email, otpCode);

        res.status(200).json({
            status: true,
            message: 'OTP has been sent to your email for password reset'
        });
    } catch (error) {
        console.error('Error in forgot password:', error.message, error.stack);
        next(error);
    }
};

// Reset Password using OTP
exports.resetPassword = async (req, res, next) => {
    const { email, code, password, confirmPassword } = req.body;

    if (!email || !code || !password || !confirmPassword) {
        return res.status(400).json({ status: false, message: 'Email, OTP code, new password, and confirm password are required' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ status: false, message: 'Password and confirm password do not match' });
    }

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }

        const otpEntry = await OTP.findOne({
            where: { userId: user.id },
            order: [['createdAt', 'DESC']]
        });

        if (!otpEntry || otpEntry.code !== code) {
            return res.status(400).json({ status: false, message: 'Invalid OTP code' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await user.update({ password: hashedPassword });

        res.status(200).json({
            status: true,
            message: 'Password reset successful. You can now log in with your new password.'
        });
    } catch (error) {
        console.error('Error resetting password:', error.message, error.stack);
        next(error);
    }
};

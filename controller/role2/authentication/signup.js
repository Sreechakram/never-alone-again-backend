const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, OTP, UserRole } = require('../../../models');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');


// const userLocation = geoip.lookup(req.ip);

// Function to generate OTP
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

// Function to save OTP to database
const saveOTPToDatabase = async (otpCode, userId) => {
    await OTP.create({
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
        subject: 'N-A-G verify OTP code',
        html: html
    };

    await transporter.sendMail(mailOptions);
};

// // Function to generate JWT token
// const generateJWT = (userId) => {
//     return jwt.sign({ id: userId }, process.env.jwt_secret, { expiresIn: process.env.expires_jwt_secret });
// };

exports.signup = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ status: false, message: 'Email is required' });
    }

    if (!password) {
        return res.status(400).json({ status: false, message: 'Password is required' });
    }

    try {
        const existingUser = await User.findOne({ where: { email }});
        // Check if the user already exists and is not verified
        if (existingUser) {
            if (existingUser.verifiedAt) {
                // If the user is already verified, skip OTP and proceed with login
                return res.status(200).json({ status: false, message: 'User is already verified. Please log in.'});
            } else {
                // If the user exists but hasn't verified, resend OTP
                const otpCode = generateOTP();
                await saveOTPToDatabase(otpCode, existingUser.id);
                await sendOTPEmail(existingUser.email, otpCode);

                return res.status(200).json({
                    status: true,
                    message: 'An OTP has been sent to your email. Please verify your account.'
                });
            }
        } else {
            // If no existing user, create a new one
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({
                email,
                password: hashedPassword,
                roleId: 2,
                socialLogin: false,
                LoginType: "email-otp",
                userName: email.split('@')[0]
            });

            // Create corresponding entry in UserRole table
            await UserRole.create({
                userId: newUser.id,
                roleId: 2 // Assign the same role ID as before
            });

            // Generate OTP and send it to the user
            const otpCode = generateOTP();
            await saveOTPToDatabase(otpCode, newUser.id);
            await sendOTPEmail(newUser.email, otpCode);

            res.status(201).json({
                status: true,
                challenge: 'Complete OTP procedure to verify and login'
            });
        }
    } catch (error) {
        console.error('Error creating or verifying user:', error.message, error.stack);
        next(error);
    }
};


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, OTP, Role } = require('../../../models');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
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

// Function to send OTP email
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

// Function to generate JWT token
const generateJWT = (userId) => {
    return jwt.sign({ id: userId }, process.env.jwt_secret, { expiresIn: process.env.expires_jwt_secret });
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ status: false, message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ status: false, message: 'Invalid email or password' });
        }

        // Check if the user is verified
        if (!user.verifiedAt) {
            // Generate a new OTP and send it to the user's email
            const otpCode = generateOTP();
            await saveOTPToDatabase(otpCode, user.id);
            await sendOTPEmail(user.email, otpCode);

            return res.status(403).json({
                status: false,
                message: 'User not verified. OTP sent to email for verification.'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ status: false, message: 'Invalid email or password' });
        }

        const token = generateJWT(user.id);
        res.status(200).json({
            status: true,
            token,
            expiresIn: process.env.expires_jwt_secret,
            message: 'Successfully logged in'
        });
    } catch (error) {
        console.error('Error during login:', error.message, error.stack);
        next(error);
    }
};


exports.getUserInfo = async (req, res, next) => {
    const userId = req.userId;
    
    try {
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password','deletedAt'] },
            include: [{ model: Role,attributes: { exclude: ['deletedAt'] } }] // Include role information
        });

        if (!user) {
            return res.status(404).json({status:false, message: 'User not found' });
        }

        res.status(200).json({status:true, user });
    } catch (error) {
        console.error('Error fetching user info:', error.message, error.stack);
        next(error);
    }
};
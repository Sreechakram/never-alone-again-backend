const jwt = require('jsonwebtoken');
const { User, OTP } = require('../../../models');

// Function to generate JWT token
const generateJWT = (userId) => {
    return jwt.sign({ id: userId }, process.env.jwt_secret, { expiresIn: process.env.expires_jwt_secret });
};

exports.verifyOTP = async (req, res, next) => {
    const { email, code } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    if (!code) {
        return res.status(400).json({ message: 'OTP code is required' });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the latest OTP for the user
        const otpEntry = await OTP.findOne({
            where: { userId: user.id },
            order: [['createdAt', 'DESC']]
        });

        if (!otpEntry) {
            return res.status(404).json({ message: 'OTP not found' });
        }

        // Check if the provided OTP matches the latest OTP
        if (otpEntry.code !== code) {
            return res.status(400).json({ message: 'Invalid OTP code, please enter the correct OTP to login' });
        }

        // Mark the user as verified
        await user.update({ verifiedAt: new Date() });

        // Generate a new JWT token
        const token = generateJWT(user.id);

        res.status(200).json({
            status: true,
            message: 'OTP verified successfully',
            token, // Send the JWT token in the response
            expiresIn: process.env.expires_jwt_secret
        });
        
    } catch (error) {
        console.error('Error verifying OTP:', error.message, error.stack);
        next(error);
    }
};

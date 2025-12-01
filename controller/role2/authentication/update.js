const { User, Role } = require('../../../models');

// Function to update user details
exports.updateUser = async (req, res, next) => {
    const { userName, email, phoneNo, city, state, country, zipcode, address } = req.body;
    const userId = req.userId; // Extracted from middleware

    if (!userId) {
        return res.status(400).json({ status: false, message: 'User ID is required' });
    }

    try {
        const user = await User.findByPk(userId, { include: Role });

        if (!user) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }

        // Update user details if provided
        if (userName) user.userName = userName;
        if (email) user.email = email;
        if (phoneNo) user.phoneNo = phoneNo;
        if (city) user.city = city;
        if (state) user.state = state;
        if (country) user.country = country;
        if (zipcode) user.zipcode = zipcode;
        if (address) user.address = address;

        await user.save();

        res.status(200).json({
            status: true,
            message: 'User updated successfully',
            user: {
                id: user.id,
                uuid: user.uuid,
                userName: user.userName,
                email: user.email,
                phoneNo: user.phoneNo,
                city: user.city,
                state: user.state,
                country: user.country,
                zipcode: user.zipcode,
                address: user.address,
                role: user.Role, // Include the role information
                verifiedAt: user.verifiedAt,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    } catch (error) {
        console.error('Error updating user details:', error.message, error.stack);
        next(error);
    }
};

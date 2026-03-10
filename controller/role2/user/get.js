const { User } = require("../../../models");

const sanitizeUser = (user) => {
  if (!user) return user;
  const data = typeof user.get === "function" ? user.get({ plain: true }) : user;
  delete data.password;
  return data;
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();

    return res.status(200).json({
      status: true,
      message: "Users fetched successfully",
      data: users.map(sanitizeUser),
    });
  } catch (error) {
    console.error("Error fetching users:", error.message, error.stack);
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User not found" });
    }

    return res.status(200).json({
      status: true,
      message: "User fetched successfully",
      data: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Error fetching user:", error.message, error.stack);
    next(error);
  }
};

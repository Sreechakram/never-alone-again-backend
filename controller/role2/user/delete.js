const { User } = require("../../../models");

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User not found" });
    }

    await user.destroy();

    return res.status(200).json({
      status: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error.message, error.stack);
    next(error);
  }
};

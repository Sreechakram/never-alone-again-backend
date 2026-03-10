const { Op } = require("sequelize");
const { User } = require("../../../models");

const sanitizeUser = (user) => {
  if (!user) return user;
  const data = typeof user.get === "function" ? user.get({ plain: true }) : user;
  delete data.password;
  return data;
};

const normalizeEmail = (email) =>
  typeof email === "string" ? email.trim().toLowerCase() : email;

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User not found" });
    }

    if (req.body.email) {
      const normalizedEmail = normalizeEmail(req.body.email);
      const existingUser = await User.findOne({
        where: { email: normalizedEmail, id: { [Op.ne]: user.id } },
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ status: false, message: "Email already exists" });
      }

      req.body.email = normalizedEmail;
    }

    await user.update(req.body);

    return res.status(200).json({
      status: true,
      message: "User updated successfully",
      data: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Error updating user:", error.message, error.stack);
    next(error);
  }
};

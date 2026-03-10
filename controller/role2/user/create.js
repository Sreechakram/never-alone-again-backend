const { User } = require("../../../models");

const sanitizeUser = (user) => {
  if (!user) return user;
  const data = typeof user.get === "function" ? user.get({ plain: true }) : user;
  delete data.password;
  return data;
};

const normalizeEmail = (email) =>
  typeof email === "string" ? email.trim().toLowerCase() : email;

exports.createUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ status: false, message: "Email is required" });
  }

  if (!password) {
    return res
      .status(400)
      .json({ status: false, message: "Password is required" });
  }

  try {
    const normalizedEmail = normalizeEmail(email);
    const existingUser = await User.findOne({ where: { email: normalizedEmail } });

    if (existingUser) {
      return res
        .status(400)
        .json({ status: false, message: "Email already exists" });
    }

    const user = await User.create({ ...req.body, email: normalizedEmail });

    return res.status(201).json({
      status: true,
      message: "User created successfully",
      data: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Error creating user:", error.message, error.stack);
    next(error);
  }
};

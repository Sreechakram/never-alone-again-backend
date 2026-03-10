const express = require("express");
const router = express.Router();

const authenticateJWT = require("../../../middleware/authMiddleware");
const userController = require("../../../controller/role2/user");

router.use(authenticateJWT);

/* User Routes */
router.post("/create",authenticateJWT, userController.createUser);
router.get("/getAll",authenticateJWT, userController.getAllUsers);
router.get("/:id",authenticateJWT, userController.getUserById);
router.post("/:id/update",authenticateJWT, userController.updateUser);
router.post("/:id/delete",authenticateJWT, userController.deleteUser);

module.exports = router;
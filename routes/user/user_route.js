const express = require("express");

const router = express.Router();
const userController = require("../../controllers/user_controller");
const { handleValidation } = require("../../middlewares/validation");
const { validator } = require("./validator");

router.post(
  "/login",
  validator("login"),
  handleValidation,
  userController.login
);

router.get(
  "/check/:email",
  validator("resetToken"),
  handleValidation,
  userController.checkEmail
);

router.get(
  "/get-reset-token/:email",
  validator("resetToken"),
  handleValidation,
  userController.getPasswordResetLink
);

router.post(
  "/reset-password",
  validator("resetPassword"),
  handleValidation,
  userController.resetPassword
);

router.post(
  "/update",
  validator("update"),
  handleValidation,
  userController.update
);

module.exports = router;

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

module.exports = router;

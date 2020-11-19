const express = require("express");

const router = express.Router();
const santaController = require("../../controllers/santa_controller");
const { checkAdmin } = require("../../middlewares/check_admin");
const { handleValidation } = require("../../middlewares/validation");
const { validator } = require("./validator");

router.post(
  "/create",
  validator("create"),
  handleValidation,
  checkAdmin,
  santaController.create
);

module.exports = router;

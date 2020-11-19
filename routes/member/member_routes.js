const express = require("express");

const router = express.Router();
const memberController = require("../../controllers/member_controller");
const { checkAdmin } = require("../../middlewares/check_admin");
const { handleValidation } = require("../../middlewares/validation");
const { validator } = require("./validator");

router.post(
  "/add",
  validator("add"),
  handleValidation,
  checkAdmin,
  memberController.add
);

module.exports = router;

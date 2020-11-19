const express = require("express");

const router = express.Router();
const groupController = require("../../controllers/group_controller");
const { handleValidation } = require("../../middlewares/validation");
const { validator } = require("./validator");

router.post(
  "/create",
  validator("create"),
  handleValidation,
  groupController.create
);

module.exports = router;

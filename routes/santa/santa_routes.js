const express = require("express");

const router = express.Router();
const santaController = require("../../controllers/santa_controller");
const { checkAdmin } = require("../../middlewares/check_admin");
const { handleValidation } = require("../../middlewares/validation");
const { verifyToken } = require("../../middlewares/verify_token");
const { validator } = require("./validator");

router.post(
  "/create",
  validator("create"),
  handleValidation,
  checkAdmin,
  santaController.create
);

router.get(
  "/get-all/:groupId",
  validator("fetch"),
  handleValidation,
  verifyToken,
  checkAdmin,
  santaController.create
);

module.exports = router;

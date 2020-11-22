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
  verifyToken,
  checkAdmin,
  santaController.create
);

router.post(
  "/send-invite",
  validator("sendInvite"),
  handleValidation,
  verifyToken,
  checkAdmin,
  santaController.sendInvite
);

router.get(
  "/pair/:token",
  validator("pair"),
  handleValidation,
  santaController.santaPair
);

router.get(
  "/get-all/:groupId",
  validator("fetch"),
  handleValidation,
  verifyToken,
  checkAdmin,
  santaController.fetchAll
);

router.post(
  "/update",
  validator("update"),
  handleValidation,
  verifyToken,
  checkAdmin,
  santaController.update
);

router.get(
  "/delete/:groupId/:santaId",
  validator("delete"),
  handleValidation,
  verifyToken,
  checkAdmin,
  santaController.delete
);

module.exports = router;

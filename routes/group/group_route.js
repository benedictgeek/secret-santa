const express = require("express");

const router = express.Router();
const groupController = require("../../controllers/group_controller");
const { handleValidation } = require("../../middlewares/validation");
const { verifyToken } = require("../../middlewares/verify_token");
const { validator } = require("./validator");

router.post(
  "/create",
  validator("create"),
  handleValidation,
  groupController.create
);

router.get("/get-groups", verifyToken, groupController.getUserGroups);

module.exports = router;

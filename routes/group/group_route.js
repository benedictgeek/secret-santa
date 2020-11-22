const express = require('express');

const router = express.Router();
const groupController = require('../../controllers/group_controller');
const { checkAdmin } = require('../../middlewares/check_admin');
const { handleValidation } = require('../../middlewares/validation');
const { verifyToken } = require('../../middlewares/verify_token');
const { validator } = require('./validator');

router.post(
  '/create',
  validator('create'),
  handleValidation,
  groupController.create
);

router.get('/get-groups', verifyToken, groupController.getUserGroups);

router.post(
  '/update',
  validator('update'),
  handleValidation,
  verifyToken,
  checkAdmin,
  groupController.update
);

router.get(
  "/delete/:groupId",
  validator("delete"),
  handleValidation,
  verifyToken,
  checkAdmin,
  groupController.delete
);

module.exports = router;

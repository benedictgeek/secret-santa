var express = require("express");
var router = express.Router();
const groupApiGroup = require("../routes/group/group_route");
const userApiGroup = require("../routes/user/user_route");
const memberApiGroup = require("../routes/member/member_routes");
const { verifyToken } = require("../middlewares/verify_token");

router.use("/groups", groupApiGroup);
router.use("/users", userApiGroup);
router.use("/members", verifyToken, memberApiGroup);

router.get("/", function (req, res, next) {
  res.json({ message: "This is Santa's Api :)" });
});

module.exports = router;
